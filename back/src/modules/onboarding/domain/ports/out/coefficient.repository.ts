import { Coefficient } from '../../value-objects/coefficient.vo';

export interface UnitCoefficientRow {
  id: string;
  identifier: string;
  coefficient: Coefficient | null;
}

export interface CoefficientUpdate {
  unitId: string;
  coefficient: Coefficient;
}

export interface CoefficientRepository {
  loadUnitsForCoefficients(communityId: string): Promise<UnitCoefficientRow[]>;
  updateCoefficients(updates: CoefficientUpdate[]): Promise<void>;
}

export const COEFFICIENT_REPOSITORY = Symbol('CoefficientRepository');
