import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Property } from '../../domain/entities/property.entity';
import { PROPERTY_REPOSITORY } from '../../domain/ports/out/property.repository';
import type { PropertyRepository } from '../../domain/ports/out/property.repository';
import { TaxId } from '../../../../shared/domain/value-objects/tax-id.vo';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { LOGGER_PORT } from '../../../../shared/domain/ports/out/logger.port';
import type { LoggerPort } from '../../../../shared/domain/ports/out/logger.port';
import { ADMINISTRATOR_PROFILE_REPOSITORY } from '../../../administrators/domain/ports/out/administrator-profile.repository';
import type { AdministratorProfileRepository } from '../../../administrators/domain/ports/out/administrator-profile.repository';

@Injectable()
export class CreatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepo: PropertyRepository,
    @Inject(ADMINISTRATOR_PROFILE_REPOSITORY)
    private readonly profileRepo: AdministratorProfileRepository,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  async execute(
    dto: CreatePropertyDto,
    userId: string,
  ): Promise<{ id: string }> {
    const administratorProfile = await this.profileRepo.findByUserId(userId);

    if (!administratorProfile) throw new NotFoundError('User', userId);

    const property = new Property(
      randomUUID(),
      dto.name,
      TaxId.create(dto.taxId),
      dto.address,
      dto.cityId,
      dto.type,
      Number(dto.totalUnits) || 1,
    );
    await this.propertyRepo.save(property, userId);

    this.logger.log(
      `Property ${property.id} created for user ${userId}`,
      'CreatePropertyUseCase',
    );

    return { id: property.id };
  }
}
