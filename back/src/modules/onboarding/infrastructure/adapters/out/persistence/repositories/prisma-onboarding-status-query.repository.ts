import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../../shared/infrastructure/prisma/prisma.service';
import {
  OnboardingStatusContext,
  OnboardingStatusQueryPort,
  UnitStatusOwnershipRow,
  UnitStatusRow,
} from '../../../../../application/ports/out/onboarding-status-query.port';
import {
  Coefficient,
  CoefficientOrigin,
} from '../../../../../domain/value-objects/coefficient.vo';

@Injectable()
export class PrismaOnboardingStatusQueryRepository implements OnboardingStatusQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async loadContext(communityId: string): Promise<OnboardingStatusContext> {
    const [unitRecords, ownershipRecords, balancesCount] = await Promise.all([
      this.prisma.unitModel.findMany({
        where: { communityId },
        select: {
          id: true,
          identifier: true,
          coefficient: true,
          coefficientOrigin: true,
        },
      }),
      this.prisma.propertyOwnershipModel.findMany({
        where: { endDate: null, unit: { communityId } },
        select: { unitId: true, ownershipPercentage: true, isPrimary: true },
      }),
      this.prisma.initialBalanceModel.count({
        where: { unit: { communityId } },
      }),
    ]);

    const ownershipsByUnitId = new Map<string, UnitStatusOwnershipRow[]>();
    for (const o of ownershipRecords) {
      const list = ownershipsByUnitId.get(o.unitId) ?? [];
      list.push({
        percentage: Number(o.ownershipPercentage),
        isPrimary: o.isPrimary,
      });
      ownershipsByUnitId.set(o.unitId, list);
    }

    const units: UnitStatusRow[] = unitRecords.map((u) => ({
      identifier: u.identifier,
      coefficient:
        u.coefficient === null
          ? null
          : Coefficient.create(
              Number(u.coefficient),
              (u.coefficientOrigin as CoefficientOrigin) ?? 'CALCULADO',
            ),
      ownerships: ownershipsByUnitId.get(u.id) ?? [],
    }));

    return { units, balancesCount };
  }
}
