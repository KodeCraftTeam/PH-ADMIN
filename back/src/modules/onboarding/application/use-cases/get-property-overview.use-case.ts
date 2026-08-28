import { Inject, Injectable } from '@nestjs/common';
import {
  PROPERTY_OVERVIEW_QUERY_PORT,
  type PropertyOverviewQueryPort,
} from '../ports/out/property-overview-query.port';
import { PropertyOverviewReadModel } from '../read-models/property-overview.read-model';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';

@Injectable()
export class GetPropertyOverviewUseCase {
  constructor(
    @Inject(PROPERTY_OVERVIEW_QUERY_PORT)
    private readonly overviewQuery: PropertyOverviewQueryPort,
  ) {}

  async execute(
    propertyId: string,
    userId: string,
  ): Promise<PropertyOverviewReadModel> {
    const overview = await this.overviewQuery.getOverview(propertyId, userId);
    if (!overview) throw new NotFoundError('Property', propertyId);
    return overview;
  }
}
