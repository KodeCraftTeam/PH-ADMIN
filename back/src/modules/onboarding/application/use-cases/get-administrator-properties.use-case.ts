import { Inject, Injectable } from '@nestjs/common';
import { PROPERTY_QUERY_PORT } from '../ports/out/property-query.port';
import type { PropertyQueryPort } from '../ports/out/property-query.port';
import { PropertyListItemReadModel } from '../read-models/property-list-item.read-model';

@Injectable()
export class GetAdministratorPropertiesUseCase {
  constructor(
    @Inject(PROPERTY_QUERY_PORT)
    private readonly propertyQuery: PropertyQueryPort,
  ) {}

  execute(userId: string): Promise<PropertyListItemReadModel[]> {
    return this.propertyQuery.listByAdministratorUserId(userId);
  }
}
