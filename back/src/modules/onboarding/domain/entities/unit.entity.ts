import { Coefficient } from '../value-objects/coefficient.vo';

export type UnitType = 'APARTAMENTO' | 'LOCAL' | 'PARQUEADERO' | 'DEPOSITO';

export class Unit {
  constructor(
    public readonly id: string,
    public readonly propertyId: string,
    public readonly code: string, // e.g. T1-101
    public readonly type: UnitType,
    public readonly areaM2: number,
    public readonly coefficient: Coefficient,
    public readonly ownerName: string,
    public readonly ownerIdNumber: string,
    public readonly ownerEmail: string,
  ) {}
}
