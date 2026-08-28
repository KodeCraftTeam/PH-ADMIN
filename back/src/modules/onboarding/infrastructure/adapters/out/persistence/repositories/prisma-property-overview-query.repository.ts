import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../../shared/infrastructure/prisma/prisma.service';
import { PropertyOverviewQueryPort } from '../../../../../application/ports/out/property-overview-query.port';
import { PropertyOverviewReadModel } from '../../../../../application/read-models/property-overview.read-model';

@Injectable()
export class PrismaPropertyOverviewQueryRepository implements PropertyOverviewQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(
    communityId: string,
    userId: string,
  ): Promise<PropertyOverviewReadModel | null> {
    const adminProfile = await this.prisma.administratorProfileModel.findUnique(
      { where: { userId } },
    );
    if (!adminProfile) return null;

    const link = await this.prisma.administratorCommunityModel.findUnique({
      where: {
        administratorId_communityId: {
          administratorId: adminProfile.id,
          communityId,
        },
      },
    });
    if (!link) return null;

    const [unitsByTypeGroups, balances] = await Promise.all([
      this.prisma.unitModel.groupBy({
        by: ['type'],
        where: { communityId },
        _count: { _all: true },
      }),
      this.prisma.initialBalanceModel.findMany({
        where: { unit: { communityId } },
        select: { balanceCOP: true, status: true },
      }),
    ]);

    const unitsByType: Record<string, number> = {};
    let totalUnits = 0;
    for (const group of unitsByTypeGroups) {
      unitsByType[group.type] = group._count._all;
      totalUnits += group._count._all;
    }

    let pendingBalanceTotal = 0;
    let unitsWithBalance = 0;
    let overdueUnits = 0;
    let paymentPlanUnits = 0;
    for (const balance of balances) {
      const value = Number(balance.balanceCOP);
      if (value > 0) {
        pendingBalanceTotal += value;
        unitsWithBalance += 1;
      }
      if (balance.status === 'EN_MORA') overdueUnits += 1;
      if (balance.status === 'ACUERDO_DE_PAGO') paymentPlanUnits += 1;
    }

    return {
      pendingBalanceTotal,
      unitsWithBalance,
      overdueUnits,
      paymentPlanUnits,
      totalUnits,
      unitsByType,
    };
  }
}
