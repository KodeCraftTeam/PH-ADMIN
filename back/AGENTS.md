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
    ports/out/           interfaces: "necesito X, no me importa cómo"
  application/
    use-cases/            una clase = una acción de negocio, orquesta entities + ports
    dto/                    forma de entrada/salida de cada use-case
  infrastructure/
    adapters/in/http/       controllers, traducen HTTP → llamada a use-case
    adapters/out/<algo>/    implementación concreta de un port
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
