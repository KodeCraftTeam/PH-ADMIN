import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../../shared/infrastructure/prisma/prisma.service';
import {
  ImportBatch,
  ImportBatchContext,
  ImportBatchRepository,
  OwnershipContextRow,
} from '../../../../../domain/ports/out/import-batch.repository';
import {
  Unit,
  UnitType,
  UnitUse,
} from '../../../../../domain/entities/unit.entity';
import {
  UnitGroup,
  UnitGroupType,
} from '../../../../../domain/entities/unit-group.entity';
import {
  DocumentType,
  Person,
  PersonType,
} from '../../../../../domain/entities/person.entity';
import {
  Coefficient,
  CoefficientOrigin,
} from '../../../../../domain/value-objects/coefficient.vo';

@Injectable()
export class PrismaImportBatchRepository implements ImportBatchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async loadContext(communityId: string): Promise<ImportBatchContext> {
    const [unitRecords, groupRecords, ownershipRecords] = await Promise.all([
      this.prisma.unitModel.findMany({ where: { communityId } }),
      this.prisma.unitGroupModel.findMany({ where: { communityId } }),
      this.prisma.propertyOwnershipModel.findMany({
        where: { endDate: null, unit: { communityId } },
        include: { unit: true },
      }),
    ]);

    const existingUnits = unitRecords.map(
      (u) =>
        new Unit(
          u.id,
          u.communityId,
          u.identifier,
          u.type as UnitType,
          Number(u.privateAreaM2),
          u.coefficient === null
            ? null
            : Coefficient.create(
                Number(u.coefficient),
                (u.coefficientOrigin as CoefficientOrigin) ?? 'CALCULADO',
              ),
          u.groupId,
          u.floor,
          u.propertyRegistrationNumber,
          u.use as UnitUse | null,
          u.status as Unit['status'],
        ),
    );

    const existingGroups = groupRecords.map(
      (g) =>
        new UnitGroup(
          g.id,
          g.communityId,
          g.name,
          g.type as UnitGroupType,
          g.sortOrder,
        ),
    );

    const existingOwnershipsByUnitIdentifier = new Map<
      string,
      OwnershipContextRow[]
    >();
    for (const o of ownershipRecords) {
      const list =
        existingOwnershipsByUnitIdentifier.get(o.unit.identifier) ?? [];
      list.push({
        percentage: Number(o.ownershipPercentage),
        isPrimary: o.isPrimary,
      });
      existingOwnershipsByUnitIdentifier.set(o.unit.identifier, list);
    }

    return {
      existingUnits,
      existingGroups,
      existingOwnershipsByUnitIdentifier,
    };
  }

  async findPersonsByDocumentNumbers(
    documentNumbers: string[],
  ): Promise<Person[]> {
    if (documentNumbers.length === 0) return [];

    const records = await this.prisma.personModel.findMany({
      where: { documentNumber: { in: documentNumbers } },
    });

    return records.map(
      (p) =>
        new Person(
          p.id,
          p.personType as PersonType,
          p.documentType as DocumentType,
          p.documentNumber,
          p.fullNameOrBusinessName,
          p.email,
          p.phone,
          p.notificationAddress,
        ),
    );
  }

  async persist(batch: ImportBatch): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.unitGroupModel.createMany({
        data: batch.groupsToCreate.map((g) => ({
          id: g.id,
          communityId: g.communityId,
          type: g.type,
          name: g.name,
          sortOrder: g.sortOrder ?? undefined,
        })),
      });

      await tx.unitModel.createMany({
        data: batch.units.map((u) => ({
          id: u.id,
          communityId: u.communityId,
          groupId: u.groupId ?? undefined,
          identifier: u.identifier,
          type: u.type,
          floor: u.floor ?? undefined,
          privateAreaM2: u.privateAreaM2,
          coefficient: u.coefficient?.percentage ?? null,
          coefficientOrigin: u.coefficient?.origin ?? null,
          propertyRegistrationNumber: u.propertyRegistrationNumber ?? undefined,
          use: u.use ?? undefined,
          status: u.status,
        })),
      });

      await tx.personModel.createMany({
        data: batch.personsToCreate.map((p) => ({
          id: p.id,
          personType: p.personType,
          documentType: p.documentType,
          documentNumber: p.documentNumber,
          fullNameOrBusinessName: p.fullNameOrBusinessName,
          email: p.email ?? undefined,
          phone: p.phone ?? undefined,
          notificationAddress: p.notificationAddress ?? undefined,
        })),
      });

      await tx.propertyOwnershipModel.createMany({
        data: batch.ownerships.map((o) => ({
          id: o.id,
          unitId: o.unitId,
          personId: o.personId,
          ownershipPercentage: o.ownershipPercentage.percentage,
          startDate: o.startDate,
          endDate: o.endDate ?? undefined,
          isPrimary: o.isPrimary,
        })),
      });
    });
  }
}
