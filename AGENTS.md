# Convenciones generales del repo (front + back)

Reglas que aplican en todo el monorepo, independientes de si el código es de `back/` o `front/`. Reglas específicas de cada lado viven en `back/AGENTS.md` y `front/AGENTS.md`.

## Idioma en el código

- **Identificadores** (variables, funciones, clases, archivos, rutas): en inglés. Ya es la convención existente en ambos proyectos.
- **Comentarios**: en español. Coincide con la convención ya establecida en el código existente (docblocks de use-cases, notas de diseño, etc.).
- **Strings visibles en la UI** (labels, mensajes de error que llegan al usuario, opciones de dropdown, badges): en español — los usuarios finales son administradores/residentes colombianos.
- Los mensajes de `DomainError` que se propagan a la respuesta HTTP/UI cuentan como texto de UI: van en español (ya es así en el código existente, no tocar ese patrón).

## Comentarios: solo cuando agregan información que el código no dice solo

No comentar QUÉ hace el código (los nombres ya lo dicen) ni el propósito general de un archivo si ya es obvio por su ubicación/nombre. Comentar solo cuando hay un motivo no obvio: una decisión de negocio, una invariante, una limitación conocida ("no hay módulo de X todavía, por eso este valor es 0/null"), o una referencia a por qué algo se hizo de una forma particular y no de otra. Si borrar el comentario no le quita nada a un lector nuevo, el comentario sobra.
