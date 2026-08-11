# Flujo de recuperación de contraseña

## Objetivo

Definir el contrato entre frontend y backend para recuperar el acceso de usuarios con contraseña y permitir el acceso mediante Google.

## 1. Solicitar recuperación

### Endpoint

```http
POST /api/auth/password/forgot
Content-Type: application/json
```

### Request

```json
{
  "email": "usuario@ejemplo.com"
}
```

### Respuesta exitosa

Se recomienda responder siempre `202 Accepted`, aunque el correo no exista o la cuenta use Google.

```json
{
  "message": "Si existe una cuenta asociada, recibirás instrucciones para recuperar el acceso."
}
```

Esto evita revelar si un correo está registrado o qué proveedor de autenticación utiliza.

## 2. Comportamiento del frontend

Cuando el backend responde `202`:

- Mostrar el estado de confirmación.
- Mostrar el correo ingresado.
- Indicar que revise la bandeja de entrada y spam.
- Mostrar `Volver a iniciar sesión`.
- Mostrar `Continuar con Google` como alternativa.
- Mostrar `Usar otro correo`.

El frontend consume el endpoint mediante:

```ts
requestPasswordReset(email)
```

## 3. Errores

Todas las respuestas de error deben incluir una propiedad `message`. Se recomienda agregar también `code` para que el frontend pueda reaccionar sin comparar textos.

### Correo inválido

```http
400 Bad Request
```

```json
{
  "message": "Ingresa un correo válido.",
  "code": "INVALID_EMAIL"
}
```

### Demasiadas solicitudes

```http
429 Too Many Requests
```

```json
{
  "message": "Espera unos minutos antes de volver a intentarlo.",
  "code": "RATE_LIMITED"
}
```

### Error interno

```http
500 Internal Server Error
```

```json
{
  "message": "No pudimos procesar la solicitud.",
  "code": "RESET_REQUEST_FAILED"
}
```

No se recomienda responder `404` cuando el correo no existe, porque eso permite descubrir cuentas registradas.

## 4. Continuar con Google

El botón de Google debe iniciar una navegación normal hacia el endpoint OAuth:

```ts
window.location.href = `${API_URL}/auth/google`;
```

### Endpoint

```http
GET /api/auth/google
```

Este endpoint debe responder con un redirect `302` hacia Google.

Después de la autorización, Google debe regresar al backend, y el backend debe redirigir al frontend:

```text
GET /api/auth/google/callback
        ↓
302 http://localhost:3000/admin
```

## 5. Reglas de seguridad

- No devolver públicamente si el correo existe.
- No devolver públicamente si la cuenta usa Google.
- No enviar contraseñas por correo.
- Usar tokens de recuperación de un solo uso.
- Establecer expiración corta para los enlaces.
- Aplicar rate limiting por correo e IP.
- Responder mensajes genéricos para correos inexistentes y cuentas de Google.

## 6. Estado actual del frontend

El frontend ya tiene:

- Ruta visual: `/forgot-password`.
- Función: `requestPasswordReset(email)`.
- Botón `Continuar con Google`.
- Manejo de estados de carga, éxito y error.

Archivos relacionados:

- `front/src/components/ui/forgot-password-page.tsx`
- `front/src/features/auth/api/password-reset.api.ts`
- `front/src/app/forgot-password/page.tsx`
