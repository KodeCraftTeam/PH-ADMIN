# Contrato API — Onboarding

> Generado desde `back/src/modules/onboarding/`. Regenerar con la skill `api-contracts` si cambian rutas, DTOs o errores.
> Base path: `/onboarding`. Ningún endpoint de este módulo tiene guard de autenticación/rol todavía.

## `POST /onboarding/properties`

**Use case:** `CreatePropertyUseCase` — `application/use-cases/create-property.use-case.ts`
**Auth:** Público (sin `@UseGuards`)
**Roles permitidos:** — (no aplica, no hay guard)

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| name | string | sí | ⚠️ ninguna — `CreatePropertyDto` no tiene decoradores `class-validator` |
| taxId | string | sí | ninguna a nivel DTO; validado recién dentro del use case vía `TaxId.create` (regex `^\d{6,10}-?\d$` tras limpiar puntos/espacios) |
| address | string | sí | ninguna |
| city | string | sí | ninguna |
| type | `'RESIDENCIAL' \| 'COMERCIAL' \| 'MIXTO'` | sí | ninguna |
| totalUnits | number | sí | ninguna |
| totalTowers | number | sí | ninguna (campo no se usa en el use case) |
| adminName | string | sí | ninguna (campo no se usa en el use case) |
| adminEmail | string | sí | ninguna (campo no se usa en el use case) |

### Response — éxito (`200`)

```json
{ "id": "string (uuid)" }
```

### Errores

| Status | Cuándo |
|---|---|
| 400 | `taxId` no matchea el formato esperado (`InvalidTaxIdError`, `shared/domain/errors/invalid-tax-id.error.ts`) |

### Notas

- TODO en código: falta validar unicidad de `taxId` (no chequea si ya existe una property con ese tax ID antes de guardar).
- `adminName`, `adminEmail`, `totalTowers` viajan en el DTO pero el use case los ignora — no generan usuario admin ni se persisten.

---

## `POST /onboarding/properties/:id/units/import`

**Use case:** `ImportUnitsUseCase` — `application/use-cases/import-units.use-case.ts`
**Auth:** Público (sin `@UseGuards`)
**Roles permitidos:** — (no aplica, no hay guard)

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

Ninguno — el use case no valida nada realmente.

### Notas

⚠️ **Stub sin implementar.** El use case solo espera 1s (`setTimeout`) y devuelve `validRows = units.length`, `coefficientSum: 0`, `errors: []` siempre — no valida coeficientes, duplicados ni emails a pesar de que el TODO en el archivo dice que debería. No persiste nada. `Coefficient.create` (VO) sí valida rango 0–100 y `CoefficientOutOfRangeError` (400) existe en el dominio, pero este use case no lo usa todavía.

---

## `POST /onboarding/properties/:id/balance`

**Use case:** `LoadBalanceUseCase` — `application/use-cases/load-balance.use-case.ts`
**Auth:** Público (sin `@UseGuards`)
**Roles permitidos:** — (no aplica, no hay guard)

### Request

- `id` — path param presente en la ruta pero **no se lee ni se pasa** al use case (`balance()` en el controller no lo usa).
- Sin body.

### Response — éxito (`200`)

Sin body.

### Errores

Ninguno.

### Notas

⚠️ **Stub sin implementar.** Solo espera 1s. No valida contra unidades existentes ni persiste balance, a pesar del TODO en el archivo.

---

## `POST /onboarding/properties/:id/activate`

**Use case:** `ActivatePropertyUseCase` — `application/use-cases/activate-property.use-case.ts`
**Auth:** Público (sin `@UseGuards`)
**Roles permitidos:** — (no aplica, no hay guard)

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

### Notas

TODO en código: falta verificar checklist completo (estructura cargada, 100% de unidades válidas, balance cargado) antes de activar — hoy solo valida el estado.

---

## Notas transversales del módulo

- **Ningún endpoint tiene autenticación ni rol.** Todo `/onboarding/*` es público tal cual está el código hoy.
- **Repositorio en memoria:** `infrastructure/adapters/out/persistence/prisma/repositories/in-memory-property.repository.ts` — a pesar del path (`.../prisma/...`), es un adapter in-memory, no persiste en base de datos real todavía. Los datos se pierden al reiniciar el proceso.
- Dos de los cuatro use-cases (`import-units`, `load-balance`) son stubs que no implementan la lógica de negocio descrita en sus propios comentarios TODO.
