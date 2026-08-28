# Contrato API — Onboarding

> Generado desde `back/src/modules/onboarding/`. Regenerar con la skill `api-contracts` si cambian rutas, DTOs o errores.
> Base path: `/onboarding`. **Todos** los endpoints del módulo requieren sesión válida (`AuthGuard`, cookie `token`). Ninguno usa `RolesGuard`/`@Roles`, así que cualquier rol autenticado puede llamarlos.
> Ningún controller usa `@HttpCode(...)`, así que el status de éxito es el default de Nest: `201` para `@Post`, `200` para `@Get`.

## `POST /onboarding/properties`

**Use case:** `CreatePropertyUseCase` — `application/use-cases/create-property.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

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
| adminName | string | sí | `@IsString`, `@IsNotEmpty` (campo no se usa en el use case) |
| adminEmail | string | sí | `@IsString`, `@IsNotEmpty` (campo no se usa en el use case; no es `@IsEmail`) |

### Response — éxito (`201`)

```json
{ "id": "string (uuid)" }
```

Persiste vía `PrismaCommunityRepository`: crea/actualiza `CommunityModel` (con `status: 'EN_CONFIGURACION'` por defecto) y el vínculo `AdministratorCommunityModel` entre el `AdministratorProfile` del usuario y la property creada. `CreatePropertyUseCase` siempre genera un `id` nuevo (`randomUUID()`) — pasar un `id` existente no actualiza esa property, crea una nueva fila.

### Errores

| Status | Cuándo |
|---|---|
| 404 | El usuario autenticado no tiene un `AdministratorProfile` (`NotFoundError('Administrator profile', userId)`, lanzado desde el use case antes de tocar el repositorio) |
| 400 | `taxId` no matchea el formato esperado (`InvalidTaxIdError`, `shared/domain/errors/invalid-tax-id.error.ts`) |
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

### Notas

- TODO en código: falta validar unicidad de `taxId` (no chequea si ya existe una property con ese tax ID antes de guardar).
- `adminName`, `adminEmail` viajan en el DTO y están validados por `class-validator`, pero el use case los sigue ignorando — no generan usuario admin ni se persisten.
- El wizard de registro (`front/src/features/onboarding`, 6 pasos) captura el `id` de la respuesta y lo guarda en `WizardState.propertyId` — lo necesitan los endpoints de cargue más abajo.
- El campo `totalTowers` que existía antes en este DTO fue eliminado (viajaba validado pero el use case nunca lo usó ni lo persistió).

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
    "status": "EN_CONFIGURACION | PENDIENTE_REVISION | ACTIVO"
  }
]
```

### Errores

| Status | Cuándo |
|---|---|
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

### Notas

- Si el usuario no tiene `AdministratorProfile`, el adapter devuelve `[]` en vez de un error (no lanza `NotFoundError` como sí hace `POST /onboarding/properties`).
- `status` ahora refleja el valor real persistido en `CommunityModel.status` (antes estaba hardcodeado a `'EN_CONFIGURACION'` en el adapter — ya corregido).

---

## `POST /onboarding/properties/:id/units/import/preview`

**Use case:** `ImportUnitsUseCase` (`commit: false`) — `application/use-cases/import-units.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

Valida el Excel de cargue (hojas **Unidades**, **Personas**, **Propietarios**) sin persistir nada — vista previa antes de confirmar. El controller **no** verifica que el `AdministratorProfile` del usuario autenticado administre esta `:id` (mismo gap que el resto del módulo — ver "Notas transversales" al final).

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
      "matricula": "string | null",
      "use": "RESIDENCIAL | COMERCIAL | MIXTO | null"
    }
  ]
}
```

`committed` siempre es `false` en este endpoint. Este endpoint **nunca** lanza `ImportValidationError` — si hay filas inválidas, vienen listadas en `errors` con status `201` igual.

**Cambio de contrato:** las unidades ya **no** traen `coefficient` en el preview/resultado — el coeficiente se asigna en un paso separado (`.../coefficients/import`, ver abajo), porque `Unit.coefficient` ahora es nullable en el momento de crear la unidad.

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

- **Unidades:** `identificador`/`tipo`/`area_privada_m2` obligatorios; `tipo`, `agrupador_tipo`, `uso` contra listas cerradas; `identificador` y `matricula_inmobiliaria` únicos por copropiedad (contra lo ya persistido + el mismo archivo). El `coeficiente` **ya no se lee de esta hoja** — se asigna en el paso de importación de coeficientes.
- **Personas:** enums de `tipo_documento`/`tipo_persona`; `numero_documento` único dentro del archivo — si ya existe una persona con ese documento en el sistema, se reutiliza (no se re-crea ni se sobreescribe).
- **Propietarios:** `identificador_unidad` debe existir en el archivo o en la copropiedad; `numero_documento_persona` debe existir en el archivo o en el sistema; `porcentaje_propiedad` 0–100 (`OwnershipPercentageOutOfRangeError` si no); `fecha_inicio` parseable; `es_principal` acepta `SI/NO` (y variantes); por unidad, la suma de `porcentaje_propiedad` (activos existentes + nuevos) debe dar 100% y debe haber **exactamente un** `es_principal = true`.

### Notas

- Recibe el `.xlsx` crudo por `multipart/form-data` y lo parsea server-side con `exceljs` (`ExceljsSpreadsheetReaderAdapter`) — se evitó `xlsx`/SheetJS por 2 CVEs altos sin parchear (Prototype Pollution + ReDoS), relevantes para parsear archivos subidos por usuarios.
- El campo `sortOrder` de `UnitGroupModel` (agrupador) no se puebla desde el Excel — siempre queda `null` en este flujo (el doc de dominio lo marca como opcional, "para ordenar visualmente").
- `Unit.coefficient` es nullable: una unidad puede existir sin coeficiente asignado hasta que se corra `.../coefficients/import`.

---

## `POST /onboarding/properties/:id/coefficients/import/preview`

**Use case:** `ImportCoefficientsUseCase` (`commit: false`) — `application/use-cases/import-coefficients.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

Paso separado del cargue de unidades: asigna/actualiza el `coefficient` de unidades que **ya existen** en la copropiedad. Valida el Excel (hoja **Coeficientes**) sin persistir — vista previa. Reutiliza `Property.assertCoefficientsComplete` contra el estado final (coeficientes existentes + los de este batch) para validar que sumen 100%, aunque no se vaya a persistir todavía.

### Request

- `id` — path param, id de la `CommunityModel`.
- Body: `multipart/form-data`, campo `file` (el `.xlsx`, hoja **Coeficientes**).

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| file | archivo `.xlsx` | sí | extensión `.xlsx` (si no, `UnsupportedFileTypeError`); ≤ 5 MB |

### Response — éxito (`201`)

```json
{
  "committed": false,
  "totalUpdated": "number",
  "coefficientSum": "number (suma final: existentes + este batch, redondeada a 2 decimales)",
  "errors": [
    { "sheet": "Coeficientes", "row": "number (0 = error transversal, ej. la suma no da 100%)", "message": "string" }
  ],
  "coefficients": [
    { "identifier": "string", "coefficient": "number", "origin": "CALCULADO | REGLAMENTO" }
  ]
}
```

### Errores

| Status | Cuándo |
|---|---|
| 400 | Archivo no es `.xlsx` (`UnsupportedFileTypeError`) |
| 400 | Falta la hoja **Coeficientes** (`InvalidWorkbookStructureError`) |
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

### Reglas de validación

- `identificador_unidad` obligatorio y debe existir ya en la copropiedad (no se crean unidades acá); `coeficiente` obligatorio, `Coefficient.create` valida `0 < percentage <= 100`; `origen` opcional, default `CALCULADO`, o `REGLAMENTO` si viene del reglamento notarial; `identificador_unidad` único dentro del archivo; la suma de coeficientes de **toda** la copropiedad (unidades sin tocar en este batch + las actualizadas) debe dar exactamente 100% — si no, error transversal (`row: 0`) aunque cada fila individual sea válida.

---

## `POST /onboarding/properties/:id/coefficients/import`

**Use case:** `ImportCoefficientsUseCase` (`commit: true`) — `application/use-cases/import-coefficients.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

Misma validación que el preview; si no hay errores, persiste los coeficientes vía `CoefficientRepository.updateCoefficients` (`PrismaCoefficientRepository`).

### Request

Igual que `.../coefficients/import/preview`.

### Response — éxito (`201`)

Mismo shape (`ImportCoefficientsResult`), con `committed: true` y `errors: []`.

### Errores

| Status | Cuándo |
|---|---|
| 400 | Archivo no es `.xlsx` (`UnsupportedFileTypeError`) |
| 400 | Falta la hoja **Coeficientes** (`InvalidWorkbookStructureError`) |
| 422 | Hay al menos una fila/regla inválida, incluida la suma ≠ 100% (`CoefficientImportValidationError`) — `details: CoefficientImportRowError[]`. No se persiste nada. |
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

---

## `POST /onboarding/properties/:id/balance/import/preview`

**Use case:** `LoadBalanceUseCase` (`commit: false`) — `application/use-cases/load-balance.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

Cargue de saldos iniciales por unidad — paso **opcional** del onboarding, no bloquea la activación (ver `puedeActivarse`/`canActivate` en `GET .../status`). `InitialBalance` es plano: un valor vigente por unidad, no un ledger por concepto. Independiente de coeficientes.

### Request

- `id` — path param, id de la `CommunityModel`.
- Body: `multipart/form-data`, campo `file` (el `.xlsx`, hoja **Saldos**).

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| file | archivo `.xlsx` | sí | extensión `.xlsx` (si no, `UnsupportedFileTypeError`); ≤ 5 MB |

### Response — éxito (`201`)

```json
{
  "committed": false,
  "totalUpserted": "number",
  "errors": [
    { "sheet": "Saldos", "row": "number", "message": "string" }
  ],
  "warnings": [
    { "sheet": "Saldos", "row": "number", "message": "string (no bloquea el commit)" }
  ],
  "balances": [
    { "identifier": "string", "balanceCOP": "number", "cutoffDate": "string (YYYY-MM-DD)", "status": "AL_DIA | EN_MORA | ACUERDO_DE_PAGO" }
  ]
}
```

### Errores

| Status | Cuándo |
|---|---|
| 400 | Archivo no es `.xlsx` (`UnsupportedFileTypeError`) |
| 400 | Falta la hoja **Saldos** (`InvalidWorkbookStructureError`) |
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

### Reglas de validación

- `identificador_unidad` obligatorio y debe existir ya en la copropiedad; `balance_cop` obligatorio; `fecha_corte` obligatoria y parseable; `status` obligatorio, uno de `AL_DIA | EN_MORA | ACUERDO_DE_PAGO`; `identificador_unidad` único dentro del archivo.
- Regla cruzada bloqueante: `status: EN_MORA` con `balance_cop = 0` es error (fila inconsistente).
- Regla cruzada no bloqueante: `status: AL_DIA` con `balance_cop > 0` genera un `warning`, no un `error` — no impide el commit.

---

## `POST /onboarding/properties/:id/balance/import`

**Use case:** `LoadBalanceUseCase` (`commit: true`) — `application/use-cases/load-balance.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

Misma validación que el preview; si no hay errores, persiste vía `BalanceRepository.upsertBatch` (`PrismaBalanceRepository`) — **upsert por `unitId`**: re-subir el mismo archivo reemplaza el saldo anterior de esa unidad completo, no lo duplica ni acumula.

### Request

Igual que `.../balance/import/preview`.

### Response — éxito (`201`)

Mismo shape (`ImportBalancesResult`), con `committed: true` y `errors: []` (`warnings` puede seguir teniendo elementos — los warnings nunca bloquean el commit).

### Errores

| Status | Cuándo |
|---|---|
| 400 | Archivo no es `.xlsx` (`UnsupportedFileTypeError`) |
| 400 | Falta la hoja **Saldos** (`InvalidWorkbookStructureError`) |
| 422 | Hay al menos un `error` (no `warning`) de fila (`BalanceImportValidationError`) — `details: BalanceImportRowIssue[]`. No se persiste nada. |
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

---

## `POST /onboarding/properties/:id/activate`

**Use case:** `ActivatePropertyUseCase` — `application/use-cases/activate-property.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

### Request

- `id` — path param, id de la property.
- Sin body.

### Response — éxito (`201`)

Sin body. Cambia `Property.status` de `EN_CONFIGURACION` a `ACTIVO` (persistido de verdad — antes de esta ronda el campo `status` no existía como columna) y dispara `notifications.inviteOwners(propertyId)` (adapter actual: `ConsoleNotificationAdapter`, solo loguea a consola).

### Errores

| Status | Cuándo |
|---|---|
| 404 | Property no existe (`NotFoundError`, `shared/domain/errors/not-found.error.ts`) |
| 400 | Property no está en `EN_CONFIGURACION` (`InvalidActivationStateError`) |
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

### Notas

⚠️ **Gap de negocio sin resolver (TODO en código):** este use case **no valida el checklist de onboarding** (unidades cargadas, coeficientes al 100%, sin propietarios faltantes) antes de activar — solo chequea que el estado actual sea `EN_CONFIGURACION`. El front bloquea el botón de activar usando `GET .../status` (`canActivate`), pero llamar este endpoint directo (sin pasar por el front) puede activar una copropiedad incompleta. Nada en el servidor lo impide hoy.

---

## `GET /onboarding/properties/:id/status`

**Use case:** `GetOnboardingStatusUseCase` — `application/use-cases/get-onboarding-status.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

Orquestador del wizard: computa el estado de completitud de los 4 pasos de carga (unidades, propietarios, coeficientes, saldos) reutilizando las mismas invariantes que los endpoints de import (`Property.assertCoefficientsComplete`, `Unit.assertOwnershipsComplete`) para que "complete" signifique exactamente lo mismo acá que al importar. `balances` es el único paso no bloqueante para `canActivate`.

### Request

- `id` — path param, id de la property. **El controller no recibe ni usa `request.user.sub`** — ver gap de autorización abajo.
- Sin body.

### Response — éxito (`200`)

```json
{
  "units": { "complete": "boolean", "loaded": "number", "declared": "number", "mismatch": "boolean (loaded > declared)" },
  "owners": { "complete": "boolean", "total": "number", "withoutOwner": "number" },
  "coefficients": { "complete": "boolean", "currentSum": "number" },
  "balances": { "complete": "boolean", "loaded": "number", "total": "number" },
  "canActivate": "boolean (units.complete && owners.complete && coefficients.complete — balances no cuenta)"
}
```

### Errores

| Status | Cuándo |
|---|---|
| 404 | Property no existe (`NotFoundError`) |
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

### Notas

- Con 0 unidades cargadas, `units.complete`, `owners.complete` y `coefficients.complete` reportan `false` explícitamente (no "vacuously true" — bug ya corregido: antes un array vacío hacía pasar las validaciones de invariante sin fallar, mostrando falsos "✓ completo").
- ⚠️ Mismo gap de autorización que el resto del módulo: no verifica que el `AdministratorProfile` del usuario autenticado administre esta `:id` — cualquier usuario autenticado puede consultar el estado de cualquier property por id.
- Este endpoint reemplazó a `GET .../estado` (ruta y shape de respuesta en español) — renombrado a inglés para seguir la convención de identificadores del repo (`AGENTS.md`).

---

## `GET /onboarding/properties/:id/overview`

**Use case:** `GetPropertyOverviewUseCase` — `application/use-cases/get-property-overview.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

Alimenta las 4 KPIs de la vista general del panel de administración (`AdminOverviewView`). **Único endpoint del módulo que sí verifica** que el usuario autenticado administre esta `:id` (vía `AdministratorCommunityModel`) — si no hay vínculo, el query port devuelve `null` y el use case lo traduce a `404`.

### Request

- `id` — path param, id de la property.
- `userId` sale de `request.user.sub`.
- Sin body.

### Response — éxito (`200`)

```json
{
  "pendingBalanceTotal": "number (suma de balanceCOP > 0)",
  "unitsWithBalance": "number (unidades con balanceCOP > 0)",
  "overdueUnits": "number (status = EN_MORA)",
  "paymentPlanUnits": "number (status = ACUERDO_DE_PAGO)",
  "totalUnits": "number",
  "unitsByType": { "APARTAMENTO": "number", "...": "number" }
}
```

### Errores

| Status | Cuándo |
|---|---|
| 404 | Property no existe, o existe pero el usuario autenticado no la administra (`NotFoundError('Property', propertyId)` en ambos casos — el caller no puede distinguirlos, es intencional para no filtrar existencia) |
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

### Notas

- No cubre cartera/PQRS/comunicados/cartelera — esas vistas del panel siguen siendo mock en el front, sin backend propio todavía (fuera de alcance por ahora).

---

## Notas transversales del módulo

- **Cargue masivo de Unidades/Personas/Propietarios y Coeficientes/Saldos por separado:** el módulo modela `UnitGroup` (agrupador: torre/manzana/etapa/sector), `Unit` (con `coefficient` **nullable**), `Person` y `PropertyOwnership` — `domain/entities/`. Persistidos vía Prisma en `UnitGroupModel`, `UnitModel`, `PersonModel`, `PropertyOwnershipModel`, `InitialBalanceModel` (`back/prisma/schema.prisma`). Las migraciones correspondientes (incluida `CommunityModel.status` y `UnitModel.coefficient` nullable + `coefficientOrigin`) **ya se aplicaron** a la base real.
- El puerto `UnitRepository` (dominio) fue reemplazado por `ImportBatchRepository` (`domain/ports/out/import-batch.repository.ts`) — un único puerto para todo el batch de import de unidades (agrupadores + unidades + personas + propietarios), porque las 4 escrituras son una sola transacción atómica. Implementado por `PrismaImportBatchRepository`. Coeficientes y saldos tienen sus propios puertos (`CoefficientRepository`, `BalanceRepository`) porque se cargan en pasos separados del wizard, no en la misma transacción.
- Parseo de Excel vía `SpreadsheetReaderPort` (`application/ports/out/spreadsheet-reader.port.ts`), implementado con `exceljs` (`ExceljsSpreadsheetReaderAdapter`) — se evitó el paquete `xlsx`/SheetJS de npm por tener 2 CVEs altos sin parchear (Prototype Pollution + ReDoS) relevantes justamente para parsear archivos subidos por usuarios. El puerto expone 3 métodos: `parseImportWorkbook` (unidades/personas/propietarios), `parseCoefficientsWorkbook`, `parseBalancesWorkbook` — cada uno valida que las hojas requeridas existan antes de parsear (`InvalidWorkbookStructureError` si falta alguna).
- `shared/domain/errors/domain-error.ts` tiene un campo opcional `details?: unknown`, y el filtro global (`shared/infrastructure/http/domain-error.filter.ts`) lo incluye en el JSON de error cuando está presente — lo usan `ImportValidationError`, `CoefficientImportValidationError` y `BalanceImportValidationError` para viajar el array completo de errores por fila.
- **Gap de autorización transversal:** de los 11 endpoints del módulo, solo `POST /properties` (crea el vínculo), `GET /properties` (filtra por admin) y `GET .../overview` (chequea el vínculo) verifican que el usuario autenticado administre la property. Los otros 8 (`units/import*`, `coefficients/import*`, `balance/import*`, `activate`, `status`) solo exigen sesión válida — cualquier admin autenticado puede leer o escribir sobre cualquier `:id` si lo conoce. Ninguno usa `RolesGuard`/`@Roles`.
- **Persistencia real vía Prisma:** `PROPERTY_REPOSITORY` → `PrismaCommunityRepository`, `PROPERTY_QUERY_PORT` → `PrismaPropertyQueryRepository`, `IMPORT_BATCH_REPOSITORY` → `PrismaImportBatchRepository`, `COEFFICIENT_REPOSITORY` → `PrismaCoefficientRepository`, `BALANCE_REPOSITORY` → `PrismaBalanceRepository`, `ONBOARDING_STATUS_QUERY_PORT` → `PrismaOnboardingStatusQueryRepository`, `PROPERTY_OVERVIEW_QUERY_PORT` → `PrismaPropertyOverviewQueryRepository`, `SPREADSHEET_READER_PORT` → `ExceljsSpreadsheetReaderAdapter` (todos en `infrastructure/adapters/out/`).
- `OnboardingModule` importa `AdministratorsModule` (además de `AuthModule`) para inyectar `ADMINISTRATOR_PROFILE_REPOSITORY` directo en `CreatePropertyUseCase` — acoplamiento cross-módulo consciente, mismo patrón "Caso C" que documenta `administrators.md`.
- El wizard de onboarding del front tiene **6 pasos** (antes 7 — se eliminó el paso "Estructura" por no estar conectado a ningún endpoint real, era solo captura manual sin efecto en el backend): Datos del conjunto → Importar unidades → Validación → Coeficientes → Cartera inicial → Revisión y activación.
