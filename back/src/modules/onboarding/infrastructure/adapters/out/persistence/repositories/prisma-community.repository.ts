import { Injectable } from '@nestjs/common';
import {
  Property,
  PropertyStatus,
  PropertyType,
} from '../../../../../domain/entities/property.entity';
import { PropertyRepository } from '../../../../../domain/ports/out/property.repository';
import { PrismaService } from '../../../../../../../shared/infrastructure/prisma/prisma.service';
import { TaxId } from '../../../../../../../shared/domain/value-objects/tax-id.vo';
import { randomUUID } from 'node:crypto';
import { NotFoundError } from '../../../../../../../shared/domain/errors/not-found.error';

@Injectable()
export class PrismaCommunityRepository implements PropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(property: Property, userId?: string): Promise<void> {
    await this.prisma.communityModel.upsert({
      where: { id: property.id },
      create: {
        id: property.id,
        name: property.name,
        taxId: property.taxId.value,
        address: property.address,
        cityId: property.cityId,
        type: property.type,
        totalUnits: property.declaredTotalUnits,
        status: property.currentStatus,
      },
      update: {
        name: property.name,
        taxId: property.taxId.value,
        address: property.address,
        cityId: property.cityId,
        type: property.type,
        totalUnits: property.declaredTotalUnits,
        status: property.currentStatus,
      },
    });

    // El vínculo administrador-copropiedad solo se (re)establece cuando el
    // caller trae userId (creación/edición desde el propio administrador).
    // ActivatePropertyUseCase llama a save() sin userId porque solo cambia
    // el status — el vínculo ya existe desde la creación.
    if (!userId) return;

    const adminProfile = await this.prisma.administratorProfileModel.findUnique(
      {
        where: { userId },
      },
    );

    if (!adminProfile) throw new NotFoundError('AdministratorProfile', userId);

    await this.prisma.administratorCommunityModel.upsert({
      where: {
        administratorId_communityId: {
          administratorId: adminProfile.id,
          communityId: property.id,
        },
      },
      create: {
        id: randomUUID(),
        administratorId: adminProfile.id,
        communityId: property.id,
      },
      update: {},
    });
  }

  async findById(id: string): Promise<Property | null> {
    const record = await this.prisma.communityModel.findUnique({
      where: { id },
    });

    if (!record) return null;

    return new Property(
      record.id,
      record.name,
      TaxId.create(record.taxId),
      record.address,
      record.cityId,
      record.type as PropertyType,
      record.totalUnits,
      record.status as PropertyStatus,
    );
  }
}
