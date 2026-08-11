import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Property } from '../../domain/entities/property.entity';
import { PROPERTY_REPOSITORY } from '../../domain/ports/out/property.repository';
import type { PropertyRepository } from '../../domain/ports/out/property.repository';
import { TaxId } from '../../../../shared/domain/value-objects/tax-id.vo';
import { CreatePropertyDto } from '../dto/create-property.dto';

/**
 * Use case (inbound port): step 1 of onboarding.
 * TODO: validate unique tax ID and add real persistence.
 */
@Injectable()
export class CreatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepo: PropertyRepository,
  ) {}

  async execute(dto: CreatePropertyDto & { id?: string }, userId: string): Promise<{ id: string }> {
    const id = dto.id || randomUUID();
    const property = new Property(
      id,
      dto.name,
      TaxId.create(dto.taxId),
      dto.address,
      dto.city,
      dto.type || 'RESIDENCIAL',
      Number(dto.totalUnits) || 1,
    );
    await this.propertyRepo.save(property, userId);
    return { id: property.id };
  }
}
