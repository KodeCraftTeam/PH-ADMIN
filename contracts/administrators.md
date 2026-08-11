# Contrato API — Administrators

> Generado desde `back/src/modules/administrators/`. Regenerar con la skill `api-contracts` si cambian rutas, DTOs o errores.
> Base path: `/administrators`.

## `POST /administrators/register`

**Use case:** `RegisterAdministratorUseCase` — `application/use-cases/register-administrator.use-case.ts`
**Auth:** Público (auto-registro, sin `@UseGuards`)
**Roles permitidos:** — (no aplica)

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| email | string | sí | `@IsEmail`, `@IsNotEmpty` |
| password | string | sí | `@IsString`, `@MinLength(8)` |
| personType | `'NATURAL' \| 'JURIDICA'` | sí | `@IsIn(['NATURAL', 'JURIDICA'])` |
| nameOrBusinessName | string | sí | `@IsString`, `@IsNotEmpty` |
| taxId | string | sí | `@IsString`, `@IsNotEmpty` (formato real validado luego por `TaxId.create`: `^\d{6,10}-?\d$` tras limpiar puntos/espacios) |
| cityId | string (uuid) | sí | `@IsUUID` |
| phoneNumber | string | no | `@IsOptional`, `@IsString` |
| address | string | no | `@IsOptional`, `@IsString` |
| legalRepresentative | string | no | `@IsOptional`, `@IsString` |

### Response — éxito (`200`)

```json
{ "id": "string (uuid, id del AdministratorProfile — NO el userId)" }
```

### Errores

| Status | Cuándo |
|---|---|
| 409 | Ya existe un perfil de administrador con ese `taxId` (`TaxIdAlreadyRegisteredError`) |
| 400 | `taxId` no matchea el formato esperado (`InvalidTaxIdError`) |
| 409 (propagado) | Si el `email` ya existe como `User`, lo lanza internamente `CreateUserUseCase` del módulo `auth` (`EmailAlreadyRegisteredError`) — este use case llama a `CreateUserUseCase.execute()` directamente, no reimplementa la validación. |

### Notas

- Este use case orquesta dos aggregates: primero valida unicidad de `taxId` y crea el `User` (vía `CreateUserUseCase` de `auth`, con `role: 'ADMIN'` fijo), después crea el `AdministratorProfile` asociado a ese `userId`. **No es transaccional**: si falla el guardado del `AdministratorProfile` después de crear el `User`, el `User` queda creado sin perfil.
- `cityId` no se valida contra el catálogo real de ciudades (`GET /cities`) en este use case — solo se exige formato UUID.

---

## Notas transversales del módulo

- Único endpoint del módulo. Sin autenticación — es el flujo de auto-registro público de administradores de PH.
