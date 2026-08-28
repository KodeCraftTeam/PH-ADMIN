import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../../shared/infrastructure/prisma/prisma.service';
import {
  CoefficientRepository,
  CoefficientUpdate,
  UnitCoefficientRow,
} from '../../../../../domain/ports/out/coefficient.repository';
import {
  Coefficient,
  CoefficientOrigin,
} from '../../../../../domain/value-objects/coefficient.vo';

@Injectable()
export class PrismaCoefficientRepository implements CoefficientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async loadUnitsForCoefficients(
    communityId: string,
  ): Promise<UnitCoefficientRow[]> {
    const records = await this.prisma.unitModel.findMany({
      where: { communityId },
      select: {
        id: true,
        identifier: true,
        coefficient: true,
        coefficientOrigin: true,
      },
    });

    return records.map((u) => ({
      id: u.id,
      identifier: u.identifier,
      coefficient:
        u.coefficient === null
          ? null
          : Coefficient.create(
              Number(u.coefficient),
              (u.coefficientOrigin as CoefficientOrigin) ?? 'CALCULADO',
            ),
    }));
  }

  async updateCoefficients(updates: CoefficientUpdate[]): Promise<void> {
    if (updates.length === 0) return;

    await this.prisma.$transaction(
      updates.map((u) =>
        this.prisma.unitModel.update({
          where: { id: u.unitId },
          data: {
            coefficient: u.coefficient.percentage,
            coefficientOrigin: u.coefficient.origin,
          },
        }),
      ),
    );
  }
}
