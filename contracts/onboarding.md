# Contrato API — Onboarding

> Generado desde `back/src/modules/onboarding/`. Regenerar con la skill `api-contracts` si cambian rutas, DTOs o errores.
> Base path: `/onboarding`. **Todos** los endpoints del módulo ahora requieren sesión válida (`AuthGuard`, cookie `token`) — ya no es público.

## `POST /onboarding/properties`

**Use case:** `CreatePropertyUseCase` — `application/use-cases/create-property.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado (sin `RolesGuard`/`@Roles`)

El `userId` sale del claim `sub` del JWT (`request.user.sub`). El use case resuelve el `AdministratorProfile` del usuario autenticado (vía `AdministratorProfileRepository`, importado directo del módulo `administrators`) y falla si no existe — por lo tanto un usuario debe haber pasado antes por `POST /administrators/register`.

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| name | string | sí | `@IsString`, `@IsNotEmpty` |
| taxId | string | sí | `@IsString`, `@IsNotEmpty` (formato real validado luego por `TaxId.create`, regex `^\d{6,10}-?\d$` tras limpiar puntos/espacios) |
| address | string | sí | `@IsString`, `@IsNotEmpty` |
| cityId | string (uuid) | sí | `@IsUUID` |
| type | `'RESIDENCIAL' \| 'COMERCIAL' \| 'MIXTO'` | sí | `@IsIn([...])` |
| totalUnits | number | sí | `@IsNumber` |
| totalTowers | number | sí | `@IsNumber` (campo no se usa en el use case) |
| adminName | string | sí | `@IsString`, `@IsNotEmpty` (campo no se usa en el use case) |
| adminEmail | string | sí | `@IsString`, `@IsNotEmpty` (campo no se usa en el use case; no es `@IsEmail`) |

### Response — éxito (`200`)

```json
{ "id": "string (uuid)" }
```

Persiste vía `PrismaCommunityRepository`: crea/actualiza `CommunityModel` y el vínculo `AdministratorCommunityModel` entre el `AdministratorProfile` del usuario y la property creada.

### Errores

| Status | Cuándo |
|---|---|
| 404 | El usuario autenticado no tiene un `AdministratorProfile` (`NotFoundError('Administrator profile', userId)`, lanzado desde el use case antes de tocar el repositorio) |
| 400 | `taxId` no matchea el formato esperado (`InvalidTaxIdError`, `shared/domain/errors/invalid-tax-id.error.ts`) |
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

### Notas

- TODO en código: falta validar unicidad de `taxId` (no chequea si ya existe una property con ese tax ID antes de guardar).
- `adminName`, `adminEmail`, `totalTowers` viajan en el DTO y ahora sí están validados por `class-validator`, pero el use case los sigue ignorando — no generan usuario admin ni se persisten.
- **Cambio reciente relevante:** el campo `city` (string libre) del contrato anterior fue reemplazado por `cityId` (uuid), y el endpoint pasó de público a requerir sesión.

---

## `GET /onboarding/properties`

**Use case:** `GetAdministratorPropertiesUseCase` — `application/use-cases/get-administrator-properties.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

**Endpoint nuevo** (no existía en el contrato previo). Lista las properties asociadas al `AdministratorProfile` del usuario autenticado (`request.user.sub`), vía `PropertyQueryPort` (`PrismaPropertyQueryRepository`), uniendo `AdministratorCommunityModel` → `CommunityModel` → `City`.

### Request

Sin body. Identidad tomada de `request.user.sub`.

### Response — éxito (`200`)

```json
[
  {
    "id": "string",
    "name": "string",
    "taxId": "string",
    "address": "string",
    "city": "string (nombre de la ciudad, no el id)",
    "type": "RESIDENCIAL | COMERCIAL | MIXTO",
    "totalUnits": "number",
    "status": "string"
  }
]
```

### Errores

| Status | Cuándo |
|---|---|
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

### Notas

- Si el usuario no tiene `AdministratorProfile`, el adapter devuelve `[]` en vez de un error (no lanza `NotFoundError` como sí hace `POST /onboarding/properties`).
- `status` en la respuesta está **hardcodeado a `'EN_CONFIGURACION'`** por el adapter (`PrismaPropertyQueryRepository`) — no refleja el `status` real persistido de la property.

---

## `POST /onboarding/properties/:id/units/import`

**Use case:** `ImportUnitsUseCase` — `application/use-cases/import-units.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

### Request

- `id` — path param, id de la property (string, sin validación de formato/existencia en el controller).
- Body:

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| units | array de `ImportedUnitDto` | sí | ⚠️ ninguna — sin decoradores `class-validator` |

`ImportedUnitDto`: `code`, `tower`, `type` (string), `areaM2` (number), `coefficient` (number), `ownerName`, `ownerIdNumber`, `ownerEmail`, `ownerPhone` — todos sin validación.

`propertyId` del DTO se sobreescribe siempre con el `:id` de la URL (`{...dto, propertyId: id}` en el controller).

### Response — éxito (`200`)

```json
{
  "totalRows": "number",
  "validRows": "number",
  "coefficientSum": "number",
  "errors": [{ "code": "string", "detail": "string" }]
}
```

### Errores

| Status | Cuándo |
|---|---|
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

Sin errores propios del use case — no valida nada realmente.

### Notas

⚠️ **Stub sin implementar.** El use case solo espera 1s (`setTimeout`) y devuelve `validRows = units.length`, `coefficientSum: 0`, `errors: []` siempre — no valida coeficientes, duplicados ni emails a pesar de que el TODO en el archivo dice que debería. No persiste nada (no toca `PropertyRepository` ni ningún adapter de `Unit`). `Coefficient.create` (VO) sí valida rango 0–100 y `CoefficientOutOfRangeError` (400) existe en el dominio, pero este use case no lo usa todavía.

---

## `POST /onboarding/properties/:id/balance`

**Use case:** `LoadBalanceUseCase` — `application/use-cases/load-balance.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

### Request

- `id` — path param presente en la ruta pero **no se lee ni se pasa** al use case (`balance()` en el controller no lo usa).
- Sin body.

### Response — éxito (`200`)

Sin body.

### Errores

| Status | Cuándo |
|---|---|
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

Sin errores propios — el use case no toca el `id` ni ningún repositorio.

### Notas

⚠️ **Stub sin implementar.** Solo espera 1s. No valida contra unidades existentes ni persiste balance, a pesar del TODO en el archivo.

---

## `POST /onboarding/properties/:id/activate`

**Use case:** `ActivatePropertyUseCase` — `application/use-cases/activate-property.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

### Request

- `id` — path param, id de la property.
- Sin body.

### Response — éxito (`200`)

Sin body. Cambia `Property.status` de `EN_CONFIGURACION` a `ACTIVO` y dispara `notifications.inviteOwners(propertyId)` (adapter actual: `ConsoleNotificationAdapter`, solo loguea a consola).

### Errores

| Status | Cuándo |
|---|---|
| 404 | Property no existe (`NotFoundError`, `shared/domain/errors/not-found.error.ts`) |
| 400 | Property no está en `EN_CONFIGURACION` (`InvalidActivationStateError`) |
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

### Notas

TODO en código: falta verificar checklist completo (estructura cargada, 100% de unidades válidas, balance cargado) antes de activar — hoy solo valida el estado.

---

## Notas transversales del módulo

- **Cambio reciente relevante:** hasta la versión anterior de este contrato, ningún endpoint de `/onboarding/*` tenía guard. Ahora los 5 endpoints (incluido el nuevo `GET /onboarding/properties`) requieren `AuthGuard` — sesión válida vía cookie `token`. Ninguno usa `RolesGuard`/`@Roles`, así que cualquier rol autenticado (`ADMIN` o `SUPER_ADMIN`) puede llamarlos.
- **Persistencia real vía Prisma:** `PROPERTY_REPOSITORY` ahora resuelve a `PrismaCommunityRepository` y `PROPERTY_QUERY_PORT` a `PrismaPropertyQueryRepository` (ambos en `infrastructure/adapters/out/persistence/repositories/`), ya no hay repositorio in-memory — los datos sí sobreviven a un reinicio del proceso.
- `OnboardingModule` ahora importa `AdministratorsModule` (además de `AuthModule`) para inyectar `ADMINISTRATOR_PROFILE_REPOSITORY` directo en `CreatePropertyUseCase` — acoplamiento cross-módulo consciente, mismo patrón "Caso C" que documenta `administrators.md`.
- Dos de los cinco use-cases (`import-units`, `load-balance`) siguen siendo stubs que no implementan la lógica de negocio descrita en sus propios comentarios TODO.
