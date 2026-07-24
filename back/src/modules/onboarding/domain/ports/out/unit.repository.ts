import { Unit } from '../../entities/unit.entity';

export interface UnitRepository {
  saveBatch(units: Unit[]): Promise<void>;
  listByProperty(propertyId: string): Promise<Unit[]>;
}

export const UNIT_REPOSITORY = Symbol('UnitRepository');
