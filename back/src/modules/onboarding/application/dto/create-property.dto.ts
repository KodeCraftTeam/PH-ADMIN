import { PropertyType } from '../../domain/entities/property.entity';

export class CreatePropertyDto {
  name!: string;
  taxId!: string;
  address!: string;
  cityId!: string;
  type!: PropertyType;
  totalUnits!: number;
  totalTowers!: number;
  adminName!: string;
  adminEmail!: string;
}
