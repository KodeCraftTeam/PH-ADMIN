# Contrato API — Shared (catálogos transversales)

> Generado desde `back/src/shared/`. No es un módulo bajo `src/modules/`, pero expone endpoints HTTP reales — se documenta acá para tener cobertura completa.
> Regenerar con la skill `api-contracts` si cambian rutas, DTOs o errores.

## `GET /cities`

**Use case:** `ListCitiesUseCase` — `application/use-cases/list-cities.use-case.ts`
**Auth:** Público (sin `@UseGuards`)
**Roles permitidos:** — (no aplica)

### Request

Sin body ni params.

### Response — éxito (`200`)

```json
[
  { "id": "string", "name": "string" }
]
```

### Errores

Ninguno documentado — el use case delega directo al `CityQueryPort` (adapter: `prisma-city-query.repository.ts`) sin manejo de errores propio.

---

## Notas transversales

- Usado por `POST /administrators/register` en el frontend para poblar `cityId`, pero el backend no valida esa referencia (ver nota en `contracts/administrators.md`).
