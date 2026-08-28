import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../../shared/infrastructure/prisma/prisma.service';
import {
  BalanceRepository,
  UnitIdentifierRow,
} from '../../../../../domain/ports/out/balance.repository';
import {
  BalanceStatus,
  InitialBalance,
} from '../../../../../domain/entities/balance.entity';

@Injectable()
export class PrismaBalanceRepository implements BalanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async loadUnitIdentifiers(communityId: string): Promise<UnitIdentifierRow[]> {
    return this.prisma.unitModel.findMany({
      where: { communityId },
      select: { id: true, identifier: true },
    });
  }

  async upsertBatch(balances: InitialBalance[]): Promise<void> {
    if (balances.length === 0) return;

    await this.prisma.$transaction(
      balances.map((b) =>
        this.prisma.initialBalanceModel.upsert({
          where: { unitId: b.unitId },
          create: {
            id: b.id,
            unitId: b.unitId,
            balanceCOP: b.balanceCOP,
            cutoffDate: b.cutoffDate,
            status: b.status,
          },
          update: {
            balanceCOP: b.balanceCOP,
            cutoffDate: b.cutoffDate,
            status: b.status,
          },
        }),
      ),
    );
  }

  async listByProperty(propertyId: string): Promise<InitialBalance[]> {
    const records = await this.prisma.initialBalanceModel.findMany({
      where: { unit: { communityId: propertyId } },
    });

    return records.map(
      (r) =>
        new InitialBalance(
          r.id,
          r.unitId,
          Number(r.balanceCOP),
          r.cutoffDate,
          r.status as BalanceStatus,
        ),
    );
  }
}
