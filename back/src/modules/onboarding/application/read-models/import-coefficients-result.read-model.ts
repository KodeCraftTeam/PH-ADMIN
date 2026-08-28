import { CoefficientImportRowError } from '../../domain/errors/coefficient-import-row-error';

export type { CoefficientImportRowError };

export interface CoefficientPreviewRow {
  identifier: string;
  coefficient: number;
  origin: string;
}

export interface ImportCoefficientsResult {
  committed: boolean;
  totalUpdated: number;
  coefficientSum: number;
  errors: CoefficientImportRowError[];
  coefficients: CoefficientPreviewRow[];
}
