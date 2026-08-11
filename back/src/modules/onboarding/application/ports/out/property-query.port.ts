import { PropertyListItemReadModel } from '../../read-models/property-list-item.read-model';

export interface PropertyQueryPort {
  listByAdministratorUserId(
    userId: string,
  ): Promise<PropertyListItemReadModel[]>;
}

export const PROPERTY_QUERY_PORT = Symbol('PropertyQueryPort');
