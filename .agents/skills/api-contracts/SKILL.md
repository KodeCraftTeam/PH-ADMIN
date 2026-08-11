---
name: api-contracts
description: Scan every use-case/controller in back/src/modules and (re)generate API contract docs (auth, roles, request/response shape, errors) grouped by feature under /contracts. Use when user asks to "document endpoints", "generate contracts", "update API docs", "/api-contracts", or after adding/changing a use-case or controller route.
---

# API Contracts

Genera y mantiene documentación de contrato para cada endpoint HTTP del backend (`back/src/modules/<feature>/`), agrupada por feature en `/contracts/<feature>.md` (raíz del repo, NO dentro de `back/`).

Un contrato por endpoint responde: qué llamar, qué autorización requiere, qué mandar, qué devuelve, qué errores puede tirar.

## Cuándo correr esto

- Usuario pide documentar/actualizar contratos de API.
- Se agregó, borró o cambió la firma de un use-case o una ruta de controller.
- Full run: recorrer TODOS los módulos. Run incremental: si el usuario nombra un módulo/feature puntual, tocar solo ese archivo.

## Proceso

### 1. Descubrir features

Cada carpeta en `back/src/modules/<feature>/` es una feature → un archivo `contracts/<feature>.md`.

### 2. Por cada feature, leer en este orden

1. `infrastructure/adapters/in/http/*.controller.ts` — fuente de verdad de: método HTTP, path, guards (`@UseGuards(...)`), roles (`@Roles(...)`), qué DTO llega por `@Body()`/`@Query()`/`@Param()`, y a qué use-case delega.
2. `infrastructure/adapters/in/http/guards/*` y `decorators/roles.decorator.ts` — para saber qué guard implica (JWT cookie/header, qué claim de rol valida).
3. `application/use-cases/**/*.use-case.ts` correspondiente a cada ruta — lógica real, qué errores de dominio puede lanzar (`throw new XxxError(...)`).
4. `application/dto/*.dto.ts` del input — leer decoradores `class-validator` (`@IsEmail`, `@IsString`, `@IsIn([...])`, `@IsOptional`, etc.) para tipar y marcar required/optional.
5. Tipo de retorno del use-case / read-model en `application/read-models/` o `application/dto/*-response.dto.ts` — shape de la respuesta exitosa.
6. `domain/errors/*.error.ts` (y `shared/domain/errors/`) — cada error expone `httpStatus` en su `super()`; ese es el status code real, no supongas 400/500 default.

No inventes campos que no existan en el DTO/entity. No inventes rutas que no estén en el controller. Si un use-case no tiene controller/route todavía (no está expuesto por HTTP), anotalo como "no expuesto aún" en vez de omitirlo — el objetivo es cobertura total de casos de uso.

### 3. Autorización — cómo determinarla

- Sin `@UseGuards` → público, sin auth.
- `@UseGuards(AuthGuard)` solo → requiere sesión válida (JWT), cualquier rol autenticado.
- `@UseGuards(AuthGuard, RolesGuard)` + `@Roles('SUPER_ADMIN', ...)` → requiere sesión + uno de esos roles exactos.
- Documentar el mecanismo de transporte del token tal cual esté implementado (cookie `token` httpOnly, header, etc. — mirar el guard, no asumir).

### 4. Formato de salida — un archivo `/contracts/<feature>.md`

```markdown
# Contrato API — <Feature>

> Generado desde `back/src/modules/<feature>/`. Regenerar con la skill `api-contracts` si cambian rutas, DTOs o errores.

## `<METHOD> /<path>`

**Use case:** `<UseCaseClassName>` — `<ruta relativa al .use-case.ts>`
**Auth:** Público | Requiere sesión (AuthGuard) | Requiere rol
**Roles permitidos:** `SUPER_ADMIN` | — (ninguno / no aplica)

### Request

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| email | string | sí | `@IsEmail` |
| ... | ... | ... | ... |

(Si va por `@Param`, indicarlo como "path param". Si no recibe body, escribir "Sin body".)

### Response — éxito (`<status code>`)

```json
{
  "campo": "tipo/ejemplo"
}
```

### Errores

| Status | Cuándo |
|---|---|
| 401 | Credenciales inválidas (`InvalidCredentialsError`) |
| 409 | Email ya registrado (`EmailAlreadyRegisteredError`) |

---
```

Repetir un bloque `## <METHOD> /<path>` por cada endpoint del controller, en el orden en que aparecen en el archivo fuente.

### 5. Reglas

- Un archivo por feature, nombre = carpeta del módulo (`onboarding` → `contracts/onboarding.md`, `administrators` → `contracts/administrators.md`).
- Idioma: español (consistente con comentarios/AGENTS.md del repo), nombres de campos/tipos en el idioma del código (inglés) tal cual están.
- Status code de éxito: si el controller no fuerza uno explícito, Nest default es `200` para `@Get`/`@Post` sin `@HttpCode` — salvo que el propio código indique otro (ej. redirect = 302, `@Res()` custom). Verificar antes de asumir 201 en un POST.
- Si dos endpoints comparten DTO, no dupliques la tabla completa dos veces con contenido idéntico salvo que el request difiera — igual mantené un bloque por endpoint (son documentos independientes), pero podés reusar la misma tabla de campos.
- Al terminar, listar en el chat qué archivos se crearon/actualizaron y qué endpoints quedaron marcados "no expuesto aún" (use-case sin controller) o "roto" (código que no compila / tipos faltantes) — no los ocultes.

## Mantenimiento

Esta skill no corre en background ni automático — se invoca a pedido. Si el usuario agrega un módulo nuevo, correr esta skill para ese feature puntual genera su contrato inicial.
