# Arquitectura de este backend — instrucciones para el agente

Este backend usa **Arquitectura Hexagonal (Ports & Adapters)** + capas de **Clean Architecture**, organizado **por feature/módulo** (`src/modules/<feature>/`), no por tipo de archivo. Al responder preguntas de arquitectura o al agregar código nuevo, seguí SIEMPRE estas reglas y esta terminología. No propongas capas, nombres o convenciones distintas a las de acá.

Regla de dependencia, en un solo sentido, nunca al revés:

```
infrastructure  →  application  →  domain
```

`domain` no importa nada de Nest, HTTP, ni base de datos.

## Estructura por módulo

```
src/modules/<feature>/
  domain/
    entities/          objetos de negocio puros, sin deps externas
    value-objects/      VOs inmutables con validación propia (ej: TaxId, Coefficient)
    ports/out/           SOLO lo que el dominio necesita para operar sobre sí mismo
                          (Repository de aggregate, Notification) — ver sección de abajo
  application/
    use-cases/            una clase = una acción de negocio, orquesta entities + ports
    dto/                    forma de INPUT de cada use-case (comandos)
    ports/out/              queries/finders de solo lectura (no protegen invariantes)
    read-models/            shapes de OUTPUT de esos queries
  infrastructure/
    adapters/in/http/       controllers, traducen HTTP → llamada a use-case
    adapters/out/<algo>/    implementación concreta de un port (de domain O de application)
  <feature>.module.ts        wiring: { provide: PORT, useClass: Adapter }
```

Referencia real: [modules/onboarding](src/modules/onboarding) es el módulo de ejemplo a seguir para cualquier módulo nuevo.

## Puerto vs adaptador

- Puerto = contrato (interfaz), vive en `domain/ports/`. Define QUÉ, no CÓMO.
- Adaptador = implementación concreta, vive en `infrastructure/adapters/`.

## `in` vs `out`

Es dirección de la llamada, no tipo de dato.

- `in` (driving): algo de afuera entra y dispara la app. Ej: HTTP → controller → use-case. No hay `ports/in/` explícito en este proyecto: el método `execute()` del use-case ya es el puerto de entrada.
- `out` (driven): la app sale a pedir algo al mundo (DB, notificaciones, APIs externas). Sí tiene `ports/out/` explícito porque domain declara qué necesita.

```
HTTP request ──► [in]  Controller ──► UseCase ──► [out] Repository port ──► DB real
```

## Cuándo es módulo nuevo vs extender el existente

Al decidir dónde poner código nuevo, aplicá este checklist EN ORDEN y explicalo así si preguntan:

1. **¿Cambia por la misma razón de negocio que lo existente?** Sí → mismo módulo.
2. **¿La palabra/concepto significa lo mismo en ambos lados?** Si el mismo término tiene otro significado o atributos distintos → modelo/módulo separado.
3. **¿Necesita la misma transacción DB que lo existente?** Sí, atómico → mismo agregado/módulo. Puede pasar después sin romper nada → candidato a desacoplar.
4. **¿Cambia con frecuencia muy distinta a lo existente?** Si sí, acoplarlo es riesgoso → separar.
5. **Test rápido:** "si borro esto, ¿lo otro sigue funcionando igual?" Sí → débilmente relacionado, separar con evento. No → dependen fuerte, mismo módulo.

Regla práctica: **no crear módulo nuevo preventivamente.** Meter la feature nueva en el módulo existente salvo que el checklist diga lo contrario o la carpeta ya esté mezclando reglas no relacionadas. Separar cuando duele, no antes.

## DTOs de input vs read models de output

`application/dto/` es solo para **inputs** (comandos: crear, actualizar, login). No mezclar con outputs — si un output es trivial (`{ id: string }`), devolverlo inline, sin tipo propio.

Cuando un output deja de ser trivial (una query real: listados, joins, agregaciones, paginado, o un shape que debe excluir campos sensibles como `passwordHash`), usar un **read model + query port — ambos en `application/`, NO en `domain/`.**

### Por qué `Repository` es dominio pero `Query`/`Finder` es aplicación

- **`Repository`** existe porque el DOMINIO necesita reconstituir el aggregate completo para operar sobre él (llamar sus métodos, validar invariantes). El puerto vive en `domain/ports/out/` porque es el dominio mismo quien lo necesita.
- **`Query`/`Finder`** no reconstruye ningún aggregate ni protege ninguna invariante — solo trae datos para mostrar. Es una necesidad de la capa de aplicación (la pantalla, el endpoint), no del dominio. Por eso su puerto va en `application/ports/out/` y su tipo de salida en `application/read-models/`.
- Señal clara de que algo es un read model y no domain: si el shape incluye cosas como `page`, `totalCount`, campos de dos aggregates distintos, o excluye campos que la entity sí tiene (`passwordHash`) — el dominio no tiene ninguna razón de negocio para saber de eso, es forma pensada para la pantalla.

`domain` nunca importa de `application` (esa regla no cambia). Pero `application` sí puede tener sus propios `ports/out/` que `domain` ni conoce — la regla de una sola dirección sigue intacta, solo que el query port ya no pretende ser del dominio.

Ejemplo real: [application/read-models/user-list-item.read-model.ts](src/modules/auth/application/read-models/user-list-item.read-model.ts) + [application/ports/out/user-query.port.ts](src/modules/auth/application/ports/out/user-query.port.ts) + [application/use-cases/list-users.use-case.ts](src/modules/auth/application/use-cases/list-users.use-case.ts).

**No crear el QueryPort preventivo.** Mientras la query sea "dame un aggregate por id", el `Repository` normal alcanza (devolver la entity o un subset armado a mano en el use-case). Separar solo cuando la query junta datos de más de un aggregate, necesita agregaciones/paginación, o debe excluir campos que la entity sí tiene.

## Manejo de errores

Nunca `throw new Error('texto')` ni excepciones de Nest (`ConflictException`, `UnauthorizedException`, etc.) desde `domain/` o `application/` — eso es infraestructura (HTTP) filtrándose donde no debe. Un use-case no sabe si lo dispara HTTP, una queue o un cron; una `ConflictException` (409 hardcodeado) no significa nada fuera de HTTP.

**Patrón: clases de error propias, con status HTTP como dato plano (no de Nest), traducidas a respuesta HTTP en un único filter genérico.**

- Base compartida: [shared/domain/errors/domain-error.ts](src/shared/domain/errors/domain-error.ts) — `abstract class DomainError extends Error`, constructor recibe `message` y `httpStatus` (`number`, default `400`). Es `number` plano, no `HttpStatus` de Nest — domain sigue sin importar el framework.
- Error genérico reusable: [shared/domain/errors/not-found.error.ts](src/shared/domain/errors/not-found.error.ts) — `NotFoundError(entity, id)`, status 404. Vive en `shared/` porque "no encontrado" no es vocabulario de ningún módulo en particular.
- Errores específicos de cada módulo: `domain/errors/<nombre>.error.ts`, uno por caso de falla (ej: `InvalidTaxIdError`, `InvalidActivationStateError` en onboarding; `EmailAlreadyRegisteredError`, `InvalidCredentialsError` en auth). Cada uno pasa su propio `httpStatus` al `super()` si no es 400 (ver `EmailAlreadyRegisteredError` → 409, `InvalidCredentialsError` → 401).
- Filter único, genérico: [shared/infrastructure/http/domain-error.filter.ts](src/shared/infrastructure/http/domain-error.filter.ts), `@Catch(DomainError)`, lee `error.httpStatus` — **nunca importa una clase de error de un módulo específico** (si lo hiciera, cada módulo nuevo obligaría a tocar este archivo compartido, rompiendo el aislamiento). Registrado global en `main.ts` con `app.useGlobalFilters(...)`.

**Nunca** crear una excepción por módulo que sepa de HTTP. **Nunca** hacer que el filter compartido conozca clases de error de un módulo puntual — el dato (`httpStatus`) viaja en el propio error, no al revés.

## Cómo extender sin romper el aislamiento

**Caso A — misma entidad, acción nueva** (ej: actualizar una Property que ya existe onboarding):
Agregar use-case nuevo en el mismo módulo, reusando el mismo port/entity. No crear port ni módulo nuevo.

**Caso B — mismo port, otra implementación** (ej: notificar por email en vez de consola):
Crear nuevo adapter en `infrastructure/adapters/out/<algo>/` implementando el port existente, y cambiar solo el wiring en `<feature>.module.ts` (`useClass`). No tocar domain ni application.

**Caso C — dominio de negocio genuinamente distinto** (ej: notificaciones con templates/colas/reintentos propios):
Crear módulo nuevo con sus 3 capas propias. Comunicación entre módulos:
- Import directo de un provider exportado — solo si el acoplamiento es aceptable.
- Evento de dominio (preferido): un módulo emite, otro escucha. Ninguno conoce al otro directamente.

**Prohibido siempre:** importar entities o repositorios de otro módulo directamente. Rompe el aislamiento que esta arquitectura busca garantizar.
