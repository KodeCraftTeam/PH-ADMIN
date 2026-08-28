import { PropertyOverviewReadModel } from '../../read-models/property-overview.read-model';

export interface PropertyOverviewQueryPort {
  // Retorna null si la copropiedad no existe o el admin no tiene acceso.
  getOverview(
    communityId: string,
    userId: string,
  ): Promise<PropertyOverviewReadModel | null>;
}

export const PROPERTY_OVERVIEW_QUERY_PORT = Symbol('PropertyOverviewQueryPort');
