import { Coefficient } from '../value-objects/coefficient.vo';
import { OwnershipPercentage } from '../value-objects/ownership-percentage.vo';
import { OwnershipNotCompleteError } from '../errors/ownership-not-complete.error';
import { MissingPrimaryOwnerError } from '../errors/missing-primary-owner.error';
import { MultiplePrimaryOwnersError } from '../errors/multiple-primary-owners.error';

export type UnitType =
  'APARTAMENTO' | 'CASA' | 'LOCAL' | 'PARQUEADERO' | 'DEPOSITO';
export type UnitUse = 'RESIDENCIAL' | 'COMERCIAL' | 'MIXTO';
export type UnitStatus = 'ACTIVA' | 'EN_CONSTRUCCION' | 'INACTIVA';

export interface UnitOwnershipRow {
  percentage: OwnershipPercentage;
  isPrimary: boolean;
}

/**
 * Aggregate root: Unit frente a PropertyOwnership. Invariante que cruza
 * entidades: la suma de OwnershipPercentage de una Unit debe ser 100% y
 * exactamente un propietario debe ser primario. Toda escritura de
 * ownerships debe pasar por este método.
 */
export class Unit {
  constructor(
    public readonly id: string,
    public readonly communityId: string,
    public readonly identifier: string,
    public readonly type: UnitType,
    public readonly privateAreaM2: number,
    public readonly coefficient: Coefficient | null,
    public readonly groupId: string | null = null,
    public readonly floor: number | null = null,
    public readonly propertyRegistrationNumber: string | null = null,
    public readonly use: UnitUse | null = null,
    public readonly status: UnitStatus = 'ACTIVA',
  ) {}

  static assertOwnershipsComplete(
    unitIdentifier: string,
    ownerships: UnitOwnershipRow[],
  ): void {
    if (ownerships.length === 0) return;

    if (
      !OwnershipPercentage.sumIsHundred(ownerships.map((o) => o.percentage))
    ) {
      const sum = ownerships.reduce(
        (acc, o) => acc + o.percentage.percentage,
        0,
      );
      throw new OwnershipNotCompleteError(unitIdentifier, sum);
    }

    const primaryCount = ownerships.filter((o) => o.isPrimary).length;
    if (primaryCount === 0) {
      throw new MissingPrimaryOwnerError(unitIdentifier);
    }
    if (primaryCount > 1) {
      throw new MultiplePrimaryOwnersError(unitIdentifier);
    }
  }
}
