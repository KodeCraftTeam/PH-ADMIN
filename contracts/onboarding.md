# Contrato API — Onboarding

> Generado desde `back/src/modules/onboarding/`. Regenerar con la skill `api-contracts` si cambian rutas, DTOs o errores.
> Base path: `/onboarding`. **Todos** los endpoints del módulo requieren sesión válida (`AuthGuard`, cookie `token`).
> Ningún controller usa `@HttpCode(...)`, así que el status de éxito es el default de Nest: `201` para `@Post`, `200` para `@Get`.

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

### Response — éxito (`201`)

```json
{ "id": "string (uuid)" }
```

Persiste vía `PrismaCommunityRepository`: crea/actualiza `CommunityModel` y el vínculo `AdministratorCommunityModel` entre el `AdministratorProfile` del usuario y la property creada. `CreatePropertyUseCase` siempre genera un `id` nuevo (`randomUUID()`) — pasar un `id` existente no actualiza esa property, crea una nueva fila.

### Errores

| Status | Cuándo |
|---|---|
| 404 | El usuario autenticado no tiene un `AdministratorProfile` (`NotFoundError('Administrator profile', userId)`, lanzado desde el use case antes de tocar el repositorio) |
| 400 | `taxId` no matchea el formato esperado (`InvalidTaxIdError`, `shared/domain/errors/invalid-tax-id.error.ts`) |
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

### Notas

- TODO en código: falta validar unicidad de `taxId` (no chequea si ya existe una property con ese tax ID antes de guardar).
- `adminName`, `adminEmail`, `totalTowers` viajan en el DTO y están validados por `class-validator`, pero el use case los sigue ignorando — no generan usuario admin ni se persisten.
- El wizard de registro (`front/src/features/onboarding`) ahora captura el `id` de la respuesta y lo guarda en `WizardState.propertyId` — lo necesitan los endpoints de cargue de unidades más abajo.

---

## `GET /onboarding/properties`

**Use case:** `GetAdministratorPropertiesUseCase` — `application/use-cases/get-administrator-properties.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

Lista las properties asociadas al `AdministratorProfile` del usuario autenticado (`request.user.sub`), vía `PropertyQueryPort` (`PrismaPropertyQueryRepository`), uniendo `AdministratorCommunityModel` → `CommunityModel` → `City`.

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

## `POST /onboarding/properties/:id/units/import/preview`

**Use case:** `ImportUnitsUseCase` (`commit: false`) — `application/use-cases/import-units.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

Valida el Excel de cargue (hojas **Unidades**, **Personas**, **Propietarios**) sin persistir nada — vista previa antes de confirmar. El controller **no** verifica que el `AdministratorProfile` del usuario autenticado administre esta `:id` (mismo gap que el resto del módulo: ningún endpoint de onboarding chequea esa relación hoy).

### Request

- `id` — path param, id de la `CommunityModel` (sin validación de formato/existencia en el controller — si no existe, `loadContext` simplemente no encuentra unidades previas).
- Body: `multipart/form-data`, campo `file` (el `.xlsx`). `FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: 5 MB } })`.

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| file | archivo `.xlsx` | sí | extensión `.xlsx` (si no, `UnsupportedFileTypeError`); ≤ 5 MB (si no, Multer corta la conexión antes de llegar al use case) |

### Response — éxito (`201`)

```json
{
  "committed": false,
  "totalUnits": "number",
  "totalPersons": "number (personas NUEVAS a crear, no cuenta las ya existentes reutilizadas por documento)",
  "totalOwnerships": "number",
  "coefficientSum": "number",
  "errors": [
    { "sheet": "Unidades | Personas | Propietarios", "row": "number (0 = error transversal, no de una fila puntual)", "message": "string" }
  ],
  "units": [
    {
      "identifier": "string",
      "type": "APARTAMENTO | CASA | LOCAL | PARQUEADERO | DEPOSITO",
      "group": "string | null",
      "floor": "number | null",
      "areaM2": "number",
      "coefficient": "number",
      "matricula": "string | null",
      "use": "RESIDENCIAL | COMERCIAL | MIXTO | null"
    }
  ]
}
```

`committed` siempre es `false` en este endpoint. Este endpoint **nunca** lanza `ImportValidationError` — si hay filas inválidas, vienen listadas en `errors` con status `201` igual.

### Errores

| Status | Cuándo |
|---|---|
| 400 | Archivo no es `.xlsx` (`UnsupportedFileTypeError`) |
| 400 | Falta alguna de las 3 hojas requeridas (`InvalidWorkbookStructureError`) |
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

---

## `POST /onboarding/properties/:id/units/import`

**Use case:** `ImportUnitsUseCase` (`commit: true`) — `application/use-cases/import-units.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

Misma validación que el endpoint de preview, pero si no hay errores persiste todo (agrupadores, unidades, personas nuevas y vínculos de propiedad) en una única transacción Prisma (`PrismaImportBatchRepository.persist`). Si hay errores, **no persiste nada** — ni una unidad, ni una persona (regla de negocio: rollback transaccional completo).

### Request

Igual que `.../import/preview`: `id` (path param) + `multipart/form-data` con campo `file` (`.xlsx`, ≤ 5 MB).

### Response — éxito (`201`)

Mismo shape que `.../import/preview` (`ImportResult`), con `committed: true` y `errors: []`.

### Errores

| Status | Cuándo |
|---|---|
| 400 | Archivo no es `.xlsx` (`UnsupportedFileTypeError`) |
| 400 | Falta alguna de las 3 hojas requeridas (`InvalidWorkbookStructureError`) |
| 422 | Hay al menos una fila/regla inválida (`ImportValidationError`) — el body incluye `details: ImportRowError[]` con el mismo detalle que `errors` en la preview. No se persiste nada. |
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

### Reglas de validación aplicadas (ambos endpoints)

- **Unidades:** `identificador`/`tipo`/`area_privada_m2` obligatorios; `tipo`, `agrupador_tipo`, `uso` contra listas cerradas; `identificador` y `matricula_inmobiliaria` únicos por copropiedad (contra lo ya persistido + el mismo archivo); `coeficiente` opcional — si falta se autocalcula `area_privada / area_total_copropiedad * 100`; la suma de coeficientes de toda la copropiedad (existentes + nuevas) debe dar 100%.
- **Personas:** enums de `tipo_documento`/`tipo_persona`; `numero_documento` único dentro del archivo — si ya existe una persona con ese documento en el sistema, se reutiliza (no se re-crea ni se sobreescribe).
- **Propietarios:** `identificador_unidad` debe existir en el archivo o en la copropiedad; `numero_documento_persona` debe existir en el archivo o en el sistema; `porcentaje_propiedad` 0–100 (`OwnershipPercentageOutOfRangeError` si no); `fecha_inicio` parseable; `es_principal` acepta `SI/NO` (y variantes); por unidad, la suma de `porcentaje_propiedad` (activos existentes + nuevos) debe dar 100% y debe haber **exactamente un** `es_principal = true`.

### Notas

- Reemplaza el stub previo (`ImportUnitsDto { units: ImportedUnitDto[] }` por `@Body()` JSON, sin `class-validator`, sin persistencia real). Ahora recibe el `.xlsx` crudo por `multipart/form-data` y lo parsea server-side con `exceljs` (`ExceljsSpreadsheetReaderAdapter`).
- El endpoint original `POST .../units/import` (que antes solo devolvía un resultado fake) ahora sí persiste; el nuevo `.../import/preview` es el que reemplaza el rol de "vista previa sin persistir" que antes no existía.
- El campo `sortOrder` de `UnitGroupModel` (agrupador) no se puebla desde el Excel — siempre queda `null` en este flujo (el doc de dominio lo marca como opcional, "para ordenar visualmente").

---

## `POST /onboarding/properties/:id/balance`

**Use case:** `LoadBalanceUseCase` — `application/use-cases/load-balance.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

### Request

- `id` — path param presente en la ruta pero **no se lee ni se pasa** al use case (`balance()` en el controller no lo usa).
- Sin body.

### Response — éxito (`201`)

Sin body.

### Errores

| Status | Cuándo |
|---|---|
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

Sin errores propios — el use case no toca el `id` ni ningún repositorio.

### Notas

⚠️ **Stub sin implementar.** Solo espera 1s. No valida contra unidades existentes ni persiste balance, a pesar del TODO en el archivo. Fuera del alcance del cargue de Unidades/Personas/Propietarios (que sí quedó implementado arriba).

---

## `POST /onboarding/properties/:id/activate`

**Use case:** `ActivatePropertyUseCase` — `application/use-cases/activate-property.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

### Request

- `id` — path param, id de la property.
- Sin body.

### Response — éxito (`201`)

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

- **Cargue masivo de Unidades/Personas/Propietarios (nuevo):** además de `Unit` (rediseñado), el módulo ahora modela `UnitGroup` (agrupador: torre/manzana/etapa/sector), `Person` y `PropertyOwnership` — `domain/entities/`. Persistidos vía `Prisma` en los modelos `UnitGroupModel`, `UnitModel`, `PersonModel`, `PropertyOwnershipModel` (`back/prisma/schema.prisma`). **Estos modelos están en el schema pero, a pedido explícito, todavía no se corrió `prisma migrate`** — las tablas no existen en la base real hasta que se aplique esa migración.
- El puerto `UnitRepository` (dominio) fue reemplazado por `ImportBatchRepository` (`domain/ports/out/import-batch.repository.ts`) — un único puerto para todo el batch de import (agrupadores + unidades + personas + propietarios), porque las 4 escrituras son una sola transacción atómica. Implementado por `PrismaImportBatchRepository`.
- Parseo de Excel vía `SpreadsheetReaderPort` (`application/ports/out/`), implementado con `exceljs` (`ExceljsSpreadsheetReaderAdapter`) — se evitó el paquete `xlsx`/SheetJS de npm por tener 2 CVEs altos sin parchear (Prototype Pollution + ReDoS) relevantes justamente para parsear archivos subidos por usuarios.
- `shared/domain/errors/domain-error.ts` ganó un campo opcional `details?: unknown`, y el filtro global (`shared/infrastructure/http/domain-error.filter.ts`) lo incluye en el JSON de error cuando está presente — lo usa `ImportValidationError` para viajar el array completo de errores por fila.
- **Cambio reciente relevante:** hasta la versión anterior de este contrato, ningún endpoint de `/onboarding/*` tenía guard. Ahora todos requieren `AuthGuard` — sesión válida vía cookie `token`. Ninguno usa `RolesGuard`/`@Roles`, así que cualquier rol autenticado (`ADMIN` o `SUPER_ADMIN`) puede llamarlos.
- **Persistencia real vía Prisma:** `PROPERTY_REPOSITORY` resuelve a `PrismaCommunityRepository` y `PROPERTY_QUERY_PORT` a `PrismaPropertyQueryRepository` (ambos en `infrastructure/adapters/out/persistence/repositories/`).
- `OnboardingModule` importa `AdministratorsModule` (además de `AuthModule`) para inyectar `ADMINISTRATOR_PROFILE_REPOSITORY` directo en `CreatePropertyUseCase` — acoplamiento cross-módulo consciente, mismo patrón "Caso C" que documenta `administrators.md`.
- `load-balance` sigue siendo un stub sin implementar (fuera del alcance del cargue). `import-units` dejó de serlo.
