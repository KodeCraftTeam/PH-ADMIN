import { Coefficient } from '../value-objects/coefficient.vo';

export type UnitType =
  'APARTAMENTO' | 'CASA' | 'LOCAL' | 'PARQUEADERO' | 'DEPOSITO';
export type UnitUse = 'RESIDENCIAL' | 'COMERCIAL' | 'MIXTO';
export type UnitStatus = 'ACTIVA' | 'EN_CONSTRUCCION' | 'INACTIVA';

export class Unit {
  constructor(
    public readonly id: string,
    public readonly communityId: string,
    public readonly identifier: string,
    public readonly type: UnitType,
    public readonly privateAreaM2: number,
    public readonly coefficient: Coefficient,
    public readonly groupId: string | null = null,
    public readonly floor: number | null = null,
    public readonly propertyRegistrationNumber: string | null = null,
    public readonly use: UnitUse | null = null,
    public readonly status: UnitStatus = 'ACTIVA',
  ) {}
}
