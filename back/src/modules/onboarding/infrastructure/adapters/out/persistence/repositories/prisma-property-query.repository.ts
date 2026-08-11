import { Injectable } from '@nestjs/common';
import { PropertyQueryPort } from '../../../../../application/ports/out/property-query.port';
import { PropertyListItemReadModel } from '../../../../../application/read-models/property-list-item.read-model';
import { PrismaService } from '../../../../../../../shared/infrastructure/prisma/prisma.service';
import { PropertyType } from '../../../../../domain/entities/property.entity';

@Injectable()
export class PrismaPropertyQueryRepository implements PropertyQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async listByAdministratorUserId(
    userId: string,
  ): Promise<PropertyListItemReadModel[]> {
    const adminProfile = await this.prisma.administratorProfileModel.findUnique(
      {
        where: { userId },
      },
    );

    if (!adminProfile) return [];

    const links = await this.prisma.administratorCommunityModel.findMany({
      where: { administratorId: adminProfile.id },
      include: {
        community: {
          include: { city: true },
        },
      },
    });

    return links.map((link) => ({
      id: link.community.id,
      name: link.community.name,
      taxId: link.community.taxId,
      address: link.community.address,
      city: link.community.city.name,
      type: link.community.type as PropertyType,
      totalUnits: link.community.totalUnits,
      status: 'EN_CONFIGURACION',
    }));
  }
}
