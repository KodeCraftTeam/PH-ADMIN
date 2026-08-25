import { ImportRowError } from '../../domain/errors/import-row-error';

export type { ImportRowError };

export interface ImportPreviewRow {
  identifier: string;
  type: string;
  group: string | null;
  floor: number | null;
  areaM2: number;
  coefficient: number;
  matricula: string | null;
  use: string | null;
}

export interface ImportResult {
  committed: boolean;
  totalUnits: number;
  totalPersons: number;
  totalOwnerships: number;
  coefficientSum: number;
  errors: ImportRowError[];
  units: ImportPreviewRow[];
}
