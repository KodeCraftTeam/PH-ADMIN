import { LoadBalanceUseCase } from './load-balance.use-case';
import {
  RawSheetRow,
  SpreadsheetReaderPort,
} from '../ports/out/spreadsheet-reader.port';
import {
  BalanceRepository,
  UnitIdentifierRow,
} from '../../domain/ports/out/balance.repository';
import { BalanceImportValidationError } from '../../domain/errors/balance-import-validation.error';
import { UnsupportedFileTypeError } from '../../domain/errors/unsupported-file-type.error';
import { ImportBalancesCommand } from '../dto/import-balances.dto';

function balanceRow(overrides: Partial<RawSheetRow> = {}): RawSheetRow {
  return {
    'identificador_unidad*': 'Apto 101',
    'balance_cop*': 450000,
    'fecha_corte*': '2026-08-01',
    'status*': 'EN_MORA',
    ...overrides,
  };
}

function unit(identifier: string): UnitIdentifierRow {
  return { id: `${identifier}-id`, identifier };
}

describe('LoadBalanceUseCase', () => {
  let reader: jest.Mocked<SpreadsheetReaderPort>;
  let repo: jest.Mocked<BalanceRepository>;
  let useCase: LoadBalanceUseCase;

  beforeEach(() => {
    reader = {
      parseImportWorkbook: jest.fn(),
      parseCoefficientsWorkbook: jest.fn(),
      parseBalancesWorkbook: jest.fn(),
    };
    repo = {
      loadUnitIdentifiers: jest.fn(),
      upsertBatch: jest.fn(),
      listByProperty: jest.fn(),
    };
    repo.loadUnitIdentifiers.mockResolvedValue([
      unit('Apto 101'),
      unit('Apto 102'),
    ]);
    reader.parseBalancesWorkbook.mockResolvedValue([balanceRow()]);
    useCase = new LoadBalanceUseCase(reader, repo);
  });

  const baseCommand = (
    overrides: Partial<ImportBalancesCommand> = {},
  ): ImportBalancesCommand => ({
    communityId: 'community-1',
    fileBuffer: Buffer.from(''),
    originalFileName: 'saldos.xlsx',
    commit: false,
    ...overrides,
  });

  it('rejects files that are not .xlsx before parsing', async () => {
    await expect(
      useCase.execute(baseCommand({ originalFileName: 'saldos.csv' })),
    ).rejects.toThrow(UnsupportedFileTypeError);
    expect(reader.parseBalancesWorkbook).not.toHaveBeenCalled();
  });

  it('previews a valid workbook without persisting anything', async () => {
    const result = await useCase.execute(baseCommand({ commit: false }));

    expect(result.committed).toBe(false);
    expect(result.errors).toEqual([]);
    expect(result.totalUpserted).toBe(1);
    expect(repo.upsertBatch).not.toHaveBeenCalled();
  });

  it('commits a valid workbook, upserting by unit', async () => {
    const result = await useCase.execute(baseCommand({ commit: true }));

    expect(result.committed).toBe(true);
    expect(repo.upsertBatch).toHaveBeenCalledTimes(1);
    const balances = repo.upsertBatch.mock.calls[0][0];
    expect(balances).toHaveLength(1);
    expect(balances[0].unitId).toBe('Apto 101-id');
  });

  it('allows a negative balance_cop (saldo a favor) without altering it', async () => {
    reader.parseBalancesWorkbook.mockResolvedValue([
      balanceRow({ 'balance_cop*': -50000, 'status*': 'AL_DIA' }),
    ]);

    const result = await useCase.execute(baseCommand({ commit: true }));

    expect(result.errors).toEqual([]);
    const balances = repo.upsertBatch.mock.calls[0][0];
    expect(balances[0].balanceCOP).toBe(-50000);
  });

  it('rejects a row referencing an unknown unit identifier', async () => {
    reader.parseBalancesWorkbook.mockResolvedValue([
      balanceRow({ 'identificador_unidad*': 'No Existe' }),
    ]);

    const result = await useCase.execute(baseCommand({ commit: false }));
    expect(
      result.errors.some((e) => e.message.includes("'No Existe' no existe")),
    ).toBe(true);
  });

  it('rejects a duplicate identificador within the same sheet', async () => {
    reader.parseBalancesWorkbook.mockResolvedValue([
      balanceRow(),
      balanceRow(),
    ]);

    const result = await useCase.execute(baseCommand({ commit: false }));
    expect(
      result.errors.some((e) =>
        e.message.includes('identificador_unidad duplicado'),
      ),
    ).toBe(true);
  });

  it('rejects EN_MORA with balance_cop = 0', async () => {
    reader.parseBalancesWorkbook.mockResolvedValue([
      balanceRow({ 'balance_cop*': 0, 'status*': 'EN_MORA' }),
    ]);

    const result = await useCase.execute(baseCommand({ commit: false }));
    expect(result.errors.some((e) => e.message.includes('EN_MORA'))).toBe(true);
  });

  it('warns (but does not reject) AL_DIA with balance_cop > 0', async () => {
    reader.parseBalancesWorkbook.mockResolvedValue([
      balanceRow({ 'balance_cop*': 15000, 'status*': 'AL_DIA' }),
    ]);

    const result = await useCase.execute(baseCommand({ commit: false }));
    expect(result.errors).toEqual([]);
    expect(result.warnings.some((w) => w.message.includes('AL_DIA'))).toBe(
      true,
    );
  });

  it('throws and does not persist when committing with validation errors', async () => {
    reader.parseBalancesWorkbook.mockResolvedValue([
      balanceRow({ 'identificador_unidad*': 'No Existe' }),
    ]);

    await expect(
      useCase.execute(baseCommand({ commit: true })),
    ).rejects.toThrow(BalanceImportValidationError);
    expect(repo.upsertBatch).not.toHaveBeenCalled();
  });
});
