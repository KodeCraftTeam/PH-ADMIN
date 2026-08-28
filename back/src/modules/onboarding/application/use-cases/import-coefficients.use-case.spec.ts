import { ImportCoefficientsUseCase } from './import-coefficients.use-case';
import {
  RawSheetRow,
  SpreadsheetReaderPort,
} from '../ports/out/spreadsheet-reader.port';
import {
  CoefficientRepository,
  UnitCoefficientRow,
} from '../../domain/ports/out/coefficient.repository';
import { CoefficientImportValidationError } from '../../domain/errors/coefficient-import-validation.error';
import { UnsupportedFileTypeError } from '../../domain/errors/unsupported-file-type.error';
import { Coefficient } from '../../domain/value-objects/coefficient.vo';
import { ImportCoefficientsCommand } from '../dto/import-coefficients.dto';

function coefficientRow(overrides: Partial<RawSheetRow> = {}): RawSheetRow {
  return {
    'identificador_unidad*': 'Apto 101',
    'coeficiente*': 50,
    origen: null,
    ...overrides,
  };
}

function unit(
  identifier: string,
  coefficient: Coefficient | null = null,
): UnitCoefficientRow {
  return { id: `${identifier}-id`, identifier, coefficient };
}

describe('ImportCoefficientsUseCase', () => {
  let reader: jest.Mocked<SpreadsheetReaderPort>;
  let repo: jest.Mocked<CoefficientRepository>;
  let useCase: ImportCoefficientsUseCase;

  beforeEach(() => {
    reader = {
      parseImportWorkbook: jest.fn(),
      parseCoefficientsWorkbook: jest.fn(),
      parseBalancesWorkbook: jest.fn(),
    };
    repo = {
      loadUnitsForCoefficients: jest.fn(),
      updateCoefficients: jest.fn(),
    };
    repo.loadUnitsForCoefficients.mockResolvedValue([
      unit('Apto 101'),
      unit('Apto 102'),
    ]);
    reader.parseCoefficientsWorkbook.mockResolvedValue([coefficientRow()]);
    useCase = new ImportCoefficientsUseCase(reader, repo);
  });

  const baseCommand = (
    overrides: Partial<ImportCoefficientsCommand> = {},
  ): ImportCoefficientsCommand => ({
    communityId: 'community-1',
    fileBuffer: Buffer.from(''),
    originalFileName: 'coeficientes.xlsx',
    commit: false,
    ...overrides,
  });

  it('rejects files that are not .xlsx before parsing', async () => {
    await expect(
      useCase.execute(baseCommand({ originalFileName: 'coeficientes.csv' })),
    ).rejects.toThrow(UnsupportedFileTypeError);
    expect(reader.parseCoefficientsWorkbook).not.toHaveBeenCalled();
  });

  it('previews without persisting, and flags missing coefficients as incomplete', async () => {
    const result = await useCase.execute(baseCommand({ commit: false }));

    expect(result.committed).toBe(false);
    expect(result.totalUpdated).toBe(1);
    expect(repo.updateCoefficients).not.toHaveBeenCalled();
    expect(
      result.errors.some(
        (e) => e.row === 0 && e.message.includes('coeficiente'),
      ),
    ).toBe(true);
  });

  it('commits when every unit ends up with a coefficient summing to 100%', async () => {
    reader.parseCoefficientsWorkbook.mockResolvedValue([
      coefficientRow({
        'identificador_unidad*': 'Apto 101',
        'coeficiente*': 60,
      }),
      coefficientRow({
        'identificador_unidad*': 'Apto 102',
        'coeficiente*': 40,
        origen: 'REGLAMENTO',
      }),
    ]);

    const result = await useCase.execute(baseCommand({ commit: true }));

    expect(result.committed).toBe(true);
    expect(result.errors).toEqual([]);
    expect(repo.updateCoefficients).toHaveBeenCalledTimes(1);
    const updates = repo.updateCoefficients.mock.calls[0][0];
    expect(updates).toHaveLength(2);
    expect(
      updates.find((u) => u.unitId === 'Apto 102-id')?.coefficient.origin,
    ).toBe('REGLAMENTO');
  });

  it('reuses an already-assigned coefficient for units not present in this batch', async () => {
    repo.loadUnitsForCoefficients.mockResolvedValue([
      unit('Apto 101'),
      unit('Apto 102', Coefficient.create(40, 'REGLAMENTO')),
    ]);
    reader.parseCoefficientsWorkbook.mockResolvedValue([
      coefficientRow({
        'identificador_unidad*': 'Apto 101',
        'coeficiente*': 60,
      }),
    ]);

    const result = await useCase.execute(baseCommand({ commit: true }));

    expect(result.committed).toBe(true);
    expect(result.coefficientSum).toBeCloseTo(100, 2);
  });

  it('rejects a row referencing an unknown unit identifier', async () => {
    reader.parseCoefficientsWorkbook.mockResolvedValue([
      coefficientRow({ 'identificador_unidad*': 'No Existe' }),
    ]);

    const result = await useCase.execute(baseCommand({ commit: false }));
    expect(
      result.errors.some((e) => e.message.includes("'No Existe' no existe")),
    ).toBe(true);
  });

  it('rejects a duplicate identificador within the same sheet', async () => {
    reader.parseCoefficientsWorkbook.mockResolvedValue([
      coefficientRow({
        'identificador_unidad*': 'Apto 101',
        'coeficiente*': 60,
      }),
      coefficientRow({
        'identificador_unidad*': 'Apto 101',
        'coeficiente*': 40,
      }),
    ]);

    const result = await useCase.execute(baseCommand({ commit: false }));
    expect(
      result.errors.some((e) =>
        e.message.includes('identificador_unidad duplicado'),
      ),
    ).toBe(true);
  });

  it('rejects an out-of-range coefficient', async () => {
    reader.parseCoefficientsWorkbook.mockResolvedValue([
      coefficientRow({ 'coeficiente*': 0 }),
    ]);

    const result = await useCase.execute(baseCommand({ commit: false }));
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects an invalid origen value', async () => {
    reader.parseCoefficientsWorkbook.mockResolvedValue([
      coefficientRow({ origen: 'INVENTADO' }),
    ]);

    const result = await useCase.execute(baseCommand({ commit: false }));
    expect(
      result.errors.some((e) => e.message.includes('origen inválido')),
    ).toBe(true);
  });

  it('throws and does not persist when committing with validation errors', async () => {
    reader.parseCoefficientsWorkbook.mockResolvedValue([
      coefficientRow({ 'identificador_unidad*': 'No Existe' }),
    ]);

    await expect(
      useCase.execute(baseCommand({ commit: true })),
    ).rejects.toThrow(CoefficientImportValidationError);
    expect(repo.updateCoefficients).not.toHaveBeenCalled();
  });
});
