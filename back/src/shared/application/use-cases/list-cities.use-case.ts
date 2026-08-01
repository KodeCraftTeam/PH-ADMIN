import { Inject, Injectable } from '@nestjs/common';
import { CITY_QUERY_PORT } from '../ports/out/city-query.port';
import type { CityQueryPort } from '../ports/out/city-query.port';
import { CityListItemReadModel } from '../read-models/city-list-item.read-model';

@Injectable()
export class ListCitiesUseCase {
  constructor(
    @Inject(CITY_QUERY_PORT) private readonly cityQuery: CityQueryPort,
  ) {}

  execute(): Promise<CityListItemReadModel[]> {
    return this.cityQuery.list();
  }
}
