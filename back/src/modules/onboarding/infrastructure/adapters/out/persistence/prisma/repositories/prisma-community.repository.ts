import { Injectable } from '@nestjs/common';
import { Property, PropertyType } from '../../../../../../domain/entities/property.entity';
import { PropertyRepository } from '../../../../../../domain/ports/out/property.repository';
import { PrismaService } from '../../../../../../../../shared/infrastructure/prisma/prisma.service';
import { TaxId } from '../../../../../../../../shared/domain/value-objects/tax-id.vo';
import { randomUUID } from 'node:crypto';

@Injectable()
export class PrismaCommunityRepository implements PropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(property: Property, userId: string): Promise<void> {
    // 1. Resolve or create AdministratorProfile for this user
    let adminProfile = await this.prisma.administratorProfileModel.findUnique({
      where: { userId },
    });

    if (!adminProfile) {
      // Get or create a default city if needed
      let city = await this.prisma.cityModel.findFirst();
      if (!city) {
        city = await this.prisma.cityModel.create({
          data: { id: randomUUID(), name: 'Bogotá' },
        });
      }

      adminProfile = await this.prisma.administratorProfileModel.create({
        data: {
          id: randomUUID(),
          userId,
          personType: 'NATURAL',
          nameOrBusinessName: 'Administrador',
          taxId: `NIT-${Date.now()}`,
          cityId: city.id,
        },
      });
    }

    // 2. Resolve city for community
    let city = await this.prisma.cityModel.findFirst({
      where: {
        name: {
          contains: property.city.trim(),
          mode: 'insensitive',
        },
      },
    });

    if (!city) {
      // Fallback to first available city or create
      city = (await this.prisma.cityModel.findFirst()) ||
        (await this.prisma.cityModel.create({
          data: { id: randomUUID(), name: property.city.trim() || 'Bogotá' },
        }));
    }

    // 3. Upsert CommunityModel
    await this.prisma.communityModel.upsert({
      where: { id: property.id },
      create: {
        id: property.id,
        name: property.name,
        taxId: property.taxId.value,
        address: property.address,
        cityId: city.id,
        totalUnits: property.declaredTotalUnits,
      },
      update: {
        name: property.name,
        taxId: property.taxId.value,
        address: property.address,
        cityId: city.id,
        totalUnits: property.declaredTotalUnits,
      },
    });

    // 4. Link AdministratorCommunityModel
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
      include: { city: true },
    });

    if (!record) return null;

    return new Property(
      record.id,
      record.name,
      TaxId.create(record.taxId),
      record.address,
      record.city?.name || 'Bogotá',
      'RESIDENCIAL',
      record.totalUnits,
    );
  }

  async findByUserId(userId: string): Promise<Property[]> {
    const adminProfile = await this.prisma.administratorProfileModel.findUnique({
      where: { userId },
    });

    if (!adminProfile) return [];

    const links = await this.prisma.administratorCommunityModel.findMany({
      where: { administratorId: adminProfile.id },
      include: {
        community: {
          include: { city: true },
        },
      },
    });

    return links.map(
      (link) =>
        new Property(
          link.community.id,
          link.community.name,
          TaxId.create(link.community.taxId),
          link.community.address,
          link.community.city?.name || 'Bogotá',
          'RESIDENCIAL',
          link.community.totalUnits,
        ),
    );
  }
}
