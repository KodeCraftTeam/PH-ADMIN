# Contrato API — Auth

> Generado desde `back/src/modules/auth/`. Regenerar con la skill `api-contracts` si cambian rutas, DTOs o errores.
> Base path: `/auth`. Cookie de sesión: `token` (httpOnly, `secure` en prod, `sameSite=none` en prod / `lax` en dev, seteada por `AuthController.cookieOptions()`).

## `POST /auth/register/start`

**Use case:** `StartRegistrationUseCase` — `application/use-cases/start-registration/start-registration.use-case.ts`
**Auth:** Público
**Roles permitidos:** — (no aplica)

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| email | string | sí | `@IsEmail`, `@IsNotEmpty` |

### Response — éxito (`200`)

Sin body de retorno explícito (use case no retorna nada; Nest serializa `undefined`).

Efecto secundario: crea `User` en estado `PENDING` con código de verificación (6 dígitos) hasheado, y envía email con plantilla `SEND_CODE_TEMPLATE_ID`.

### Errores

| Status | Cuándo |
|---|---|
| 409 | Email ya registrado (`EmailAlreadyRegisteredError`) |

---

## `POST /auth/register/resend`

**Use case:** `ResendCodeUseCase` — `application/use-cases/resend-code/resend-code.use-case.ts`
**Auth:** Público
**Roles permitidos:** — (no aplica)

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| email | string | sí | `@IsEmail`, `@IsNotEmpty` |

### Response — éxito (`200`)

Sin body. Reenvía código solo si el usuario existe y está `PENDING` con código previo; igual responde 200 en cualquier caso (no filtra estado al cliente).

### Errores

| Status | Cuándo |
|---|---|
| 404 | Usuario no existe (`UserNotFoundError`) |

---

## `POST /auth/register/verify`

**Use case:** `VerifyCodeUseCase` — `application/use-cases/verify-code/verify-code.use-case.ts`
**Auth:** Público
**Roles permitidos:** — (no aplica)

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| email | string | sí | `@IsEmail`, `@IsNotEmpty` |
| code | string | sí | `@IsNotEmpty` |

### Response — éxito (`200`)

Sin body. Marca el código como verificado (lo borra) si es válido y el usuario está `PENDING`.

### Errores

| Status | Cuándo |
|---|---|
| 401 | Usuario no existe, no está `PENDING`, o código no coincide (`InvalidVerificationCodeError` — mismo error para los 3 casos, no distingue motivo) |

---

## `POST /auth/register/complete`

**Use case:** `CompleteRegisterUseCase` — `application/use-cases/complete-register/complete-register.use-case.ts`
**Auth:** Público
**Roles permitidos:** — (no aplica)

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| email | string | sí | `@IsEmail`, `@IsNotEmpty` |
| name | string | sí | `@IsNotEmpty` |
| password | string | sí | `@IsNotEmpty` |

### Response — éxito (`200`)

Sin body. Hashea password, setea `name`, pasa `status` a `ONBOARDING`.

### Errores

| Status | Cuándo |
|---|---|
| 404 | Usuario no existe (`UserNotFoundError`) |

---

## `POST /auth/login`

**Use case:** `LoginUseCase` — `application/use-cases/login/login.use-case.ts`
**Auth:** Público
**Roles permitidos:** — (no aplica)

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| email | string | sí | `@IsEmail`, `@IsNotEmpty` |
| password | string | sí | `@IsString`, `@IsNotEmpty` |

### Response — éxito (`200`)

Setea cookie `token` (JWT, 7 días) y responde body reducido (no incluye `accessToken` en el JSON, solo en la cookie):

```json
{
  "name": "string",
  "role": "SUPER_ADMIN | ADMIN"
}
```

### Errores

| Status | Cuándo |
|---|---|
| 401 | Email no existe, usuario sin `passwordHash`, o password no coincide (`InvalidCredentialsError` — mismo mensaje para los 3 casos) |

---

## `POST /auth/logout`

**Use case:** ninguno (lógica inline en el controller)
**Auth:** Público (no valida sesión antes de limpiar)
**Roles permitidos:** — (no aplica)

### Request

Sin body.

### Response — éxito (`200`)

Sin body. Limpia cookie `token`.

### Errores

Ninguno documentado.

---

## `GET /auth/me`

**Use case:** `GetCurrentUserUseCase` — `application/use-cases/get-current-user/get-current-user.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

### Request

Sin body. Identidad tomada de `request.user.sub` (claim `sub` del JWT).

### Response — éxito (`200`)

```json
{
  "name": "string",
  "role": "SUPER_ADMIN | ADMIN",
  "needsOnBoarding": "boolean (true si user.status === 'ONBOARDING')"
}
```

### Errores

| Status | Cuándo |
|---|---|
| 401 | `userId` del token no corresponde a ningún usuario (`InvalidCredentialsError`) |
| 401 | Sin cookie `token`, o token inválido/expirado (`AuthGuard` lanza `UnauthorizedException` con `code: TOKEN_MISSING \| TOKEN_EXPIRED \| TOKEN_INVALID`, no pasa por `DomainErrorFilter`) |

---

## `PATCH /auth/me/status`

**Use case:** `UpdateUserStatusUseCase` — `application/use-cases/update-user-status/update-user-status.use-case.ts`
**Auth:** Requiere sesión (`AuthGuard`, lee cookie `token`)
**Roles permitidos:** cualquier rol autenticado

Cambia el `status` del propio usuario autenticado (`request.user.sub`, no recibe `userId` por body). También se invoca internamente (sin pasar por HTTP) desde `RegisterAdministratorUseCase` en el módulo `administrators` — ver [contracts/administrators.md](administrators.md) — para sacar al usuario de `ONBOARDING` tras registrar su perfil.

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| status | `'ACTIVE' \| 'INACTIVE' \| 'PENDING' \| 'ONBOARDING'` | sí | `@IsIn([...])` |

### Response — éxito (`200`)

Sin body.

### Errores

| Status | Cuándo |
|---|---|
| 404 | `userId` del token no corresponde a ningún usuario (`NotFoundError`, de `shared/domain/errors`) |
| 401 | Sin cookie `token`, o token inválido/expirado (`AuthGuard`, `UnauthorizedException`) |

### Notas

- No valida transiciones de estado (cualquier status autenticado puede pasar a cualquier otro, incluyendo volver a `PENDING` u `ONBOARDING` manualmente).

---

## `GET /auth/google`

**Use case:** ninguno (lógica inline en el controller — arma URL de OAuth y redirige)
**Auth:** Público
**Roles permitidos:** — (no aplica)

### Request

Sin body.

### Response — éxito (`302`)

Redirect a `https://accounts.google.com/o/oauth2/v2/auth?...` con `client_id`, `redirect_uri`, `scope=openid email profile`, `response_type=code` (leídos de `process.env.GOOGLE_CLIENT_ID` / `GOOGLE_REDIRECT_URI` directo en el controller, no vía `ConfigService`).

### Errores

| Status | Cuándo |
|---|---|
| 400 | Falta `GOOGLE_CLIENT_ID` o `GOOGLE_REDIRECT_URI` en config (`BadRequestException` de Nest, no `DomainError`) |

---

## `GET /auth/google/callback`

**Use case:** `LoginGoogleUseCase` — `application/use-cases/login-google/login-google.use-case.ts`
**Auth:** Público (endpoint de callback de OAuth)
**Roles permitidos:** — (no aplica)

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| code | string (query param) | sí | ninguna (`@Query('code')` sin DTO ni validador) |

### Response — éxito (`302`)

Setea cookie `token` (JWT, 7 días) y redirige a `${CORS_ORIGIN.split(',')[0] ?? 'http://localhost:3000'}${targetPath}`, donde `targetPath` es `/superadmin` si `role === 'SUPER_ADMIN'` o `/admin` en cualquier otro caso. Si el email de Google no existe como usuario, lo crea automáticamente con `role: 'ADMIN'`, `status: 'ONBOARDING'`, sin password (`passwordHash: null`).

### Errores

El use case captura explícitamente y lanza `UnauthorizedException` de Nest (401, **no** `DomainError` — no pasa por `DomainErrorFilter` pero cae en el mismo status code por default de Nest):

| Status | Cuándo |
|---|---|
| 401 | Faltan `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` o `GOOGLE_REDIRECT_URI` en config del servidor |
| 401 | Google respondió error en el intercambio de `code`, o no devolvió `id_token` |
| 401 | `id_token` recibido de Google tiene formato inválido (menos de 2 partes al hacer split por `.`) |
| 500 | Cualquier otro fallo no capturado (ej. red, JSON inválido) sube sin manejar |

---

## `POST /auth/register`

**Use case:** `CreateUserUseCase` — `application/use-cases/create-user/create-user.use-case.ts`
**Auth:** Requiere rol (`AuthGuard` + `RolesGuard`)
**Roles permitidos:** `SUPER_ADMIN`

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| email | string | sí | `@IsEmail`, `@IsNotEmpty` |
| password | string | sí | `@IsString`, `@IsNotEmpty` |
| name | string | sí | `@IsString`, `@IsNotEmpty` |
| role | `'SUPER_ADMIN' \| 'ADMIN'` | sí | `@IsIn(['SUPER_ADMIN', 'ADMIN'])` |

### Response — éxito (`200`)

```json
{ "id": "string (uuid)" }
```

### Errores

| Status | Cuándo |
|---|---|
| 409 | Email ya registrado (`EmailAlreadyRegisteredError`) |
| 403 | Usuario autenticado sin rol `SUPER_ADMIN` (`RolesGuard`, `ForbiddenException`) |
| 401 | Sin cookie `token` válida (`AuthGuard`, `UnauthorizedException`) |

---

## `GET /auth/users`

**Use case:** `ListUsersUseCase` — `application/use-cases/list-users/list-users.use-case.ts`
**Auth:** Requiere rol (`AuthGuard` + `RolesGuard`)
**Roles permitidos:** `SUPER_ADMIN`

### Request

Sin body.

### Response — éxito (`200`)

```json
[
  {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "SUPER_ADMIN | ADMIN"
  }
]
```

### Errores

| Status | Cuándo |
|---|---|
| 403 | Rol insuficiente (`RolesGuard`, `ForbiddenException`) |
| 401 | Sin sesión válida (`AuthGuard`, `UnauthorizedException`) |

---

## `POST /auth/forgot-password`

**Use case:** `ForgotPasswordUseCase` — `application/use-cases/forgot-password/forgot-password.use-case.ts`
**Auth:** Público
**Roles permitidos:** — (no aplica)

Paso 1 del flujo de recuperación de contraseña (3 endpoints, sin token/link — mismo patrón de código de 6 dígitos que `register/*`).

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| email | string | sí | `@IsEmail`, `@IsNotEmpty` |

### Response — éxito (`200`)

Sin body. Genera código de 6 dígitos, lo hashea y lo guarda en `user.code`, envía email con plantilla `SEND_RESET_PASSWORD_TEMPLATE_ID`.

### Errores

| Status | Cuándo |
|---|---|
| 404 | Email no registrado (`UserNotFoundError`, `code: USER_NOT_FOUND`) |
| 409 | Usuario sin `passwordHash` — cuenta creada vía Google, no tiene contraseña que recuperar (`GoogleAccountPasswordRecoveryError`, `code: GOOGLE_ACCOUNT_PASSWORD_RECOVERY`) |
| 503 | Fallo del proveedor de correo (`EmailDeliveryError`, `shared/domain/errors`, `code: EMAIL_DELIVERY_FAILED`) — no se lanza explícitamente desde este use case hoy, pero el `EmailSenderPort`/adapter puede propagarlo |

### Notas

- Revela si el email existe o no (404 explícito) y si es cuenta Google (409) — no aplica mitigación de email enumeration.

---

## `POST /auth/reset-password/verify`

**Use case:** `VerifyResetCodeUseCase` — `application/use-cases/verify-reset-code/verify-reset-code.use-case.ts`
**Auth:** Público
**Roles permitidos:** — (no aplica)

Paso 2 (opcional para el front): valida el código sin consumirlo, para poder mostrar "código correcto" antes del formulario de nueva contraseña. No muta el usuario — el código sigue siendo válido después de llamar este endpoint.

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| email | string | sí | `@IsEmail`, `@IsNotEmpty` |
| code | string | sí | `@IsNotEmpty` |

### Response — éxito (`200`)

Sin body.

### Errores

| Status | Cuándo |
|---|---|
| 401 | Usuario no existe, no tiene código pendiente, o código no coincide (`InvalidVerificationCodeError` — mismo error para los 3 casos) |

---

## `POST /auth/reset-password`

**Use case:** `ResetPasswordUseCase` — `application/use-cases/reset-password/reset-password.use-case.ts`
**Auth:** Público
**Roles permitidos:** — (no aplica)

Paso 3 (obligatorio): vuelve a pedir el código — es el único paso que realmente autoriza el cambio, el paso 2 es solo UX. Hashea `newPassword`, la guarda y limpia `user.code`.

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| email | string | sí | `@IsEmail`, `@IsNotEmpty` |
| code | string | sí | `@IsNotEmpty` |
| newPassword | string | sí | `@IsString`, `@IsNotEmpty` |

### Response — éxito (`200`)

Sin body.

### Errores

| Status | Cuándo |
|---|---|
| 401 | Usuario no existe, no tiene código pendiente, o código no coincide (`InvalidVerificationCodeError` — mismo error para los 3 casos) |

---

## Notas transversales del módulo

- `AuthGuard` (`infrastructure/adapters/in/http/guards/jwt-auth.guard.ts`) lee la cookie `token` (no header `Authorization`); si falta o es inválida lanza `UnauthorizedException` (401) con un `code` en el body (`TOKEN_MISSING` / `TOKEN_EXPIRED` / `TOKEN_INVALID`) — **no** el genérico `403 Forbidden` que documentaban versiones previas de este contrato.
- `RolesGuard` sigue devolviendo `403 Forbidden` cuando el usuario autenticado no tiene el rol requerido, y `false` (sin roles definidos) si el handler no tiene `@Roles(...)`.
- `LoginGoogleUseCase` lanza `UnauthorizedException` de Nest directamente en vez de un `DomainError` propio — se desvía del patrón de manejo de errores documentado en `back/AGENTS.md` (application no debería conocer excepciones de Nest), pero el resultado HTTP (401) es el mismo que si fuera `DomainError`.
- Flujo de recuperación de contraseña son 3 endpoints (`forgot-password` → `reset-password/verify` → `reset-password`), simétrico al de registro (`register/start` → `register/verify` → `register/complete`) pero sin gate de `status` — a diferencia de `VerifyCodeUseCase` (que exige `status === 'PENDING'`), `VerifyResetCodeUseCase`/`ResetPasswordUseCase` no chequean status porque en reset el usuario ya está `ACTIVE`/`ONBOARDING`, nunca `PENDING`.
