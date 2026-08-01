import { CityListItemReadModel } from '../../read-models/city-list-item.read-model';

export interface CityQueryPort {
  list(): Promise<CityListItemReadModel[]>;
}

export const CITY_QUERY_PORT = Symbol('CityQueryPort');
