import { Inject, Injectable } from '@nestjs/common';
import { PROPERTY_REPOSITORY } from '../../domain/ports/out/property.repository';
import type { PropertyRepository } from '../../domain/ports/out/property.repository';

export interface PropertyListItemResponse {
  id: string;
  name: string;
  taxId: string;
  address: string;
  city: string;
  type: string;
  totalUnits: number;
  status: string;
}

@Injectable()
export class GetAdministratorPropertiesUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepo: PropertyRepository,
  ) {}

  async execute(userId: string): Promise<PropertyListItemResponse[]> {
    const properties = await this.propertyRepo.findByUserId(userId);
    return properties.map((p) => ({
      id: p.id,
      name: p.name,
      taxId: p.taxId.value,
      address: p.address,
      city: p.city,
      type: p.type,
      totalUnits: p.declaredTotalUnits,
      status: p.currentStatus,
    }));
  }
}
