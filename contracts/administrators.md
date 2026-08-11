# Contrato API — Administrators

> Generado desde `back/src/modules/administrators/`. Regenerar con la skill `api-contracts` si cambian rutas, DTOs o errores.
> Base path: `/administrators`.

## `POST /administrators/register`

**Use case:** `RegisterAdministratorUseCase` — `application/use-cases/register-administrator.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** `ADMIN`

Paso de onboarding posterior al registro/login (`POST /auth/register/*`, `POST /auth/login`, o Google). El `userId` sale del claim `sub` del JWT (`request.user.sub`), no del body — este endpoint completa el perfil de administrador para el usuario ya autenticado, no crea un `User` nuevo.

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
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

Efecto secundario: llama `UpdateUserStatusUseCase.execute(userId, { status: 'ACTIVE' })` (provider exportado por `AuthModule`, inyectado directo — ver [contracts/auth.md#patch-authmestatus](auth.md)) para sacar al usuario de `ONBOARDING` una vez completa su perfil. Si esa llamada falla (usuario no encontrado), toda la operación falla — no hay rollback del `AdministratorProfile` ya guardado, ambas escrituras no están en la misma transacción DB.

### Errores

| Status | Cuándo |
|---|---|
| 409 | Ya existe un perfil de administrador con ese `taxId` (`TaxIdAlreadyRegisteredError`) |
| 400 | `taxId` no matchea el formato esperado (`InvalidTaxIdError`) |
| 404 | (improbable) el `userId` del JWT ya no existe en `auth` al momento de actualizar status (`NotFoundError`) |
| 403 | Sin cookie `token` válida (`AuthGuard` bloquea, Nest responde 403 genérico) |

### Notas

- No valida si el `userId` ya tiene un perfil de administrador (`AdministratorProfileRepository.findByUserId` existe en el port pero este use case no lo llama) — un mismo usuario podría terminar con más de un `AdministratorProfile` si repite la llamada con `taxId` distintos.
- `cityId` no se valida contra el catálogo real de ciudades (`GET /cities`) en este use case — solo se exige formato UUID.
- Acopla `administrators` a `auth` vía import directo de `UpdateUserStatusUseCase` (Caso C de `AGENTS.md`, "acoplamiento aceptable") — decisión consciente en vez de evento de dominio, por ser una consecuencia 1:1 obligatoria sin otros consumidores.

---

## Notas transversales del módulo

- Único endpoint del módulo. Requiere sesión — completa el perfil de un usuario que ya se registró/logueó en `auth`.
