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

## Aggregates (DDD, enfoque pragmático — no purista)

Un **Aggregate** se define exclusivamente por la existencia de una **invariante**: una regla de negocio que solo se puede validar viendo varias entidades juntas (nunca una validación de un solo campo aislado, eso es un VO). Si no hay invariante que cruce entidades, **no fuerces** estructura de agregado — entidades independientes, cada una con su propio repositorio, está bien.

Todo Aggregate ES una Entity, pero no toda Entity es un Aggregate. Un Aggregate puede ser una sola Entity sin hijos, mientras tenga su propio repositorio y ciclo de vida independiente (ej: `Property` ya calificaba como root antes de tener invariante — repo propio + lifecycle `activate()`).

**Regla clave — el Aggregate Root es dueño de la REGLA, no necesariamente de la colección viva de hijos.** Evitá el anti-patrón de "large aggregate" (Vernon): si los hijos que participan de la invariante pueden ser cientos/miles (ej: `Unit` dentro de `Property`), NO los embebas como array en memoria del root (`property.units: Unit[]`) — cargarías el agregado completo para escrituras triviales que ni tocan la invariante (renombrar `Property`, cambiar `floor` de una `Unit`). En su lugar:

- El Aggregate Root expone un método (puede ser `static` si no depende de su propio estado) que recibe SOLO los valores mínimos que participan de la invariante y tira un `DomainError` propio si se viola.
- El use-case es quien junta esos valores (vía el repo/query que corresponda) y llama al método antes de persistir.
- Los campos de las entidades hijas que NO participan de la invariante tienen su propio repositorio/escritura libre, sin pasar por el root.

**Una entidad "hija" de una invariante no deja de ser entidad normal para todo lo demás.** `Unit` participa de la invariante de `Property` (coeficientes) y ES ELLA MISMA root de su propia invariante (ownership) — pero eso NO significa que toda escritura sobre `Unit` deba pasar por `Property`. Ejemplo: un use-case futuro `UpdateUnitFloorUseCase` o `DeactivateUnitUseCase` edita `Unit` directo, con su propio repo, sin cargar ni tocar `Property` para nada — porque `floor`/`status` no participan de ninguna invariante. Solo el use-case que específicamente crea/cambia el `coefficient` de una `Unit` tiene que consultar `Property.assertCoefficientsComplete(...)` antes de persistir. Regla general: **la invariante decide QUÉ escritura puntual pasa por el root, no CUÁL entidad "pertenece" al agregado para siempre.** Forzar todo por el root (aunque no toque la invariante) es justamente el large-aggregate que querés evitar.

Ejemplo real en [modules/onboarding](src/modules/onboarding):
- `Property.assertCoefficientsComplete(coefficients: Coefficient[])` en [domain/entities/property.entity.ts](src/modules/onboarding/domain/entities/property.entity.ts) — invariante: suma de `Coefficient` de todas las `Unit` de la comunidad = 100%. No recibe `Unit[]`, solo los `Coefficient` ya extraídos.
- `Unit.assertOwnershipsComplete(unitIdentifier, ownerships)` en [domain/entities/unit.entity.ts](src/modules/onboarding/domain/entities/unit.entity.ts) — invariante: suma de `OwnershipPercentage` de una `Unit` = 100% + exactamente un propietario primario.
- Ambos métodos son llamados desde [application/use-cases/import-units.use-case.ts](src/modules/onboarding/application/use-cases/import-units.use-case.ts), que atrapa el `DomainError` y lo traduce a error de fila para el preview — el use-case no reimplementa la regla, solo la invoca.

**No Event Sourcing** salvo que auditoría histórica sea requisito explícito de negocio — persistencia relacional normal con foreign keys alcanza. **Datos derivados de una invariante (sumas, totales) se calculan al vuelo** en el método de invariante o en un read model — nunca se guardan duplicados en la tabla del root.

**No crear repositorio nuevo preventivo** para una entidad hija solo porque "podría ser un aggregate": mientras ningún use-case necesite cargar/mutar esa entidad fuera de un flujo batch existente (ej: `ImportBatchRepository`), ese port ad-hoc de aplicación alcanza. Separar el repo del Aggregate Root cuando un use-case nuevo realmente necesite reconstituir esa entidad para operar sobre ella.

### Cómo detectar un Aggregate Root a nivel de código (NO es "tiene repo propio")

Tener `domain/ports/out/<x>.repository.ts` dedicado **no es** el requisito — es señal opcional que puede faltar. Ejemplo real: `Unit` es Aggregate Root de la invariante de ownership y **no tiene** `unit.repository.ts` propio; se escribe hoy vía `ImportBatchRepository` (compartido, del flujo batch), porque ningún use-case necesita todavía reconstituir un `Unit` suelto fuera de ese flujo. Si mañana aparece un use-case que sí lo necesita (ej: transferir propiedad de una unidad), ahí se crea `unit.repository.ts` — no antes.

La señal que SÍ es confiable, y no depende de infraestructura: **la entidad misma expone el método que enforcea la invariante**, marcado con doc-comment `/** Aggregate root: ... */` arriba de la clase (ver `Property` y `Unit`). Eso es lo que hace a algo Aggregate Root — no dónde ni cómo se persiste. Repo dedicado es un detalle de infraestructura que puede llegar después o nunca, según lo pida un use-case real.

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
