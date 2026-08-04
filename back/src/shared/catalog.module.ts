import { Module } from '@nestjs/common';
import { ListCitiesUseCase } from './application/use-cases/list-cities.use-case';
import { CITY_QUERY_PORT } from './application/ports/out/city-query.port';
import { CitiesController } from './infrastructure/http/cities.controller';
import { PrismaCityQueryRepository } from './infrastructure/persistence/prisma-city-query.repository';

/**
 * Cross-cutting reference-data catalog (not owned by any single business module).
 */
@Module({
  controllers: [CitiesController],
  providers: [
    ListCitiesUseCase,
    { provide: CITY_QUERY_PORT, useClass: PrismaCityQueryRepository },
  ],
})
export class CatalogModule {}
