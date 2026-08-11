import { PropertyType } from '../../domain/entities/property.entity';

export interface PropertyListItemReadModel {
  id: string;
  name: string;
  taxId: string;
  address: string;
  city: string;
  type: PropertyType;
  totalUnits: number;
  status: string;
}
