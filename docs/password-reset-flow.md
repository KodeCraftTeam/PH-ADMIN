# Flujo de recuperación de contraseña

## Endpoint de solicitud

```http
POST /api/auth/forgot-password
Content-Type: application/json
```

### Request

```json
{
  "email": "usuario@ejemplo.com"
}
```

### Éxito

El backend responde `201 Created` sin body cuando genera el código de seis dígitos, lo guarda de forma segura y envía el correo.

El frontend cambia al paso `Ingresa el código`, donde el usuario introduce los 6 dígitos recibidos por correo.

En entornos Windows donde Node no confíe en el certificado TLS de la red local,
inicia el backend con `npm run start:dev` o `npm run start:prod`; ambos comandos
usan el almacén de certificados del sistema mediante `--use-system-ca`.

## Errores

Los errores de dominio usan este formato:

```json
{
  "error": "GoogleAccountPasswordRecoveryError",
  "code": "GOOGLE_ACCOUNT_PASSWORD_RECOVERY",
  "message": "..."
}
```

| Status | Code | Comportamiento del frontend |
|---|---|---|
| 400 | `BadRequest` | Muestra el mensaje de validación del correo. |
| 404 | `USER_NOT_FOUND` | Muestra que no se encontró una cuenta con ese correo. |
| 409 | `GOOGLE_ACCOUNT_PASSWORD_RECOVERY` | Muestra `Continuar con Google`. |
| 500 | Sin código | Muestra un error genérico. |
| 503 | `EMAIL_DELIVERY_FAILED` | Muestra que el correo no pudo enviarse y permite intentar de nuevo. |

El backend actual devuelve `404` y `409`, por lo que revela si el correo existe o si la cuenta fue creada con Google. Si se necesita evitar email enumeration, el backend debe responder de forma genérica.

## Comportamiento del frontend

El frontend consume:

```ts
requestPasswordReset(email)
```

Cuando recibe `201`:

- Muestra el paso para introducir el código de 6 dígitos.
- Permite reenviar el código usando el mismo endpoint.
- Permite volver a usar otro correo.

Después de validar el código:

- Muestra los campos de nueva contraseña y confirmación.
- Envía `email`, `code` y `newPassword` a `POST /api/auth/reset-password`.
- Muestra `Contraseña actualizada` cuando el backend responde correctamente.

Cuando recibe `GOOGLE_ACCOUNT_PASSWORD_RECOVERY`:

- Muestra el mensaje de cuenta Google.
- Muestra el botón `Continuar con Google`.

## OAuth de Google

El botón inicia una navegación normal:

```ts
window.location.href = `${API_URL}/auth/google`;
```

### Endpoints

```http
GET /api/auth/google
GET /api/auth/google/callback
```

El backend responde con `302` hacia Google y, después de la autorización, redirige al frontend con la cookie de sesión.

## Archivos relacionados

- `front/src/components/ui/forgot-password-page.tsx`
- `front/src/features/auth/api/password-reset.api.ts`
- `front/src/lib/http-client.ts`
- `back/src/modules/auth/infrastructure/adapters/in/http/auth.controller.ts`
- `back/src/shared/infrastructure/http/domain-error.filter.ts`
- `back/src/shared/domain/errors/email-delivery.error.ts`
- `contracts/auth.md`
