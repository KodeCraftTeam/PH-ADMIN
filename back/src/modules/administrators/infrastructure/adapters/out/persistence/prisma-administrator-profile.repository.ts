import { Injectable } from '@nestjs/common';
import { AdministratorProfileRepository } from '../../../../domain/ports/out/administrator-profile.repository';
import { AdministratorProfile } from '../../../../domain/entities/administrator-profile.entity';
import { PrismaService } from '../../../../../../shared/infrastructure/prisma/prisma.service';
import { toDomainAdministratorProfile } from './prisma-administrator-profile.mapper';

@Injectable()
export class PrismaAdministratorProfileRepository implements AdministratorProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(profile: AdministratorProfile): Promise<void> {
    await this.prisma.administratorProfileModel.upsert({
      where: { id: profile.id },
      create: {
        id: profile.id,
        userId: profile.userId,
        personType: profile.personType,
        nameOrBusinessName: profile.nameOrBusinessName,
        taxId: profile.taxId.value,
        phoneNumber: profile.phoneNumber,
        address: profile.address,
        cityId: profile.cityId,
        legalRepresentative: profile.legalRepresentative,
      },
      update: {
        personType: profile.personType,
        nameOrBusinessName: profile.nameOrBusinessName,
        taxId: profile.taxId.value,
        phoneNumber: profile.phoneNumber,
        address: profile.address,
        cityId: profile.cityId,
        legalRepresentative: profile.legalRepresentative,
      },
    });
  }

  async findByUserId(userId: string): Promise<AdministratorProfile | null> {
    const record = await this.prisma.administratorProfileModel.findUnique({
      where: { userId },
    });
    return record ? toDomainAdministratorProfile(record) : null;
  }

  async findByTaxId(taxId: string): Promise<AdministratorProfile | null> {
    const record = await this.prisma.administratorProfileModel.findUnique({
      where: { taxId },
    });
    return record ? toDomainAdministratorProfile(record) : null;
  }
}
