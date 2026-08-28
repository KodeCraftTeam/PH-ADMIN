import { Module } from '@nestjs/common';
import { ListCitiesUseCase } from './application/use-cases/list-cities.use-case';
import { CITY_QUERY_PORT } from './application/ports/out/city-query.port';
import { CitiesController } from './infrastructure/http/cities.controller';
import { PrismaCityQueryRepository } from './infrastructure/persistence/prisma-city-query.repository';

/**
 * Catálogo de datos de referencia transversal (no pertenece a ningún módulo de negocio en particular).
 */
@Module({
  controllers: [CitiesController],
  providers: [
    ListCitiesUseCase,
    { provide: CITY_QUERY_PORT, useClass: PrismaCityQueryRepository },
  ],
})
export class CatalogModule {}
