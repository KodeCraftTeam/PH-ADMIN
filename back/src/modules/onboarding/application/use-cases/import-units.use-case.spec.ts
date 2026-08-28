import { ImportUnitsUseCase } from './import-units.use-case';
import {
  ParsedImportWorkbook,
  RawSheetRow,
  SpreadsheetReaderPort,
} from '../ports/out/spreadsheet-reader.port';
import {
  ImportBatchContext,
  ImportBatchRepository,
} from '../../domain/ports/out/import-batch.repository';
import { Person } from '../../domain/entities/person.entity';
import { ImportValidationError } from '../../domain/errors/import-validation.error';
import { UnsupportedFileTypeError } from '../../domain/errors/unsupported-file-type.error';
import { ImportUnitsCommand } from '../dto/import-units.dto';

function unitRow(overrides: Partial<RawSheetRow> = {}): RawSheetRow {
  return {
    'identificador*': 'Apto 101',
    'tipo*': 'apartamento',
    agrupador_nombre: null,
    agrupador_tipo: null,
    piso: 1,
    'area_privada_m2*': 50,
    matricula_inmobiliaria: null,
    uso: 'residencial',
    ...overrides,
  };
}

function personRow(overrides: Partial<RawSheetRow> = {}): RawSheetRow {
  return {
    'tipo_documento*': 'CC',
    'numero_documento*': '123',
    'nombre_razon_social*': 'Juan Perez',
    'tipo_persona*': 'natural',
    email: null,
    telefono: null,
    direccion_notificacion: null,
    ...overrides,
  };
}

function ownershipRow(overrides: Partial<RawSheetRow> = {}): RawSheetRow {
  return {
    'identificador_unidad*': 'Apto 101',
    'numero_documento_persona*': '123',
    'porcentaje_propiedad*': 100,
    'fecha_inicio*': '2024-01-15',
    'es_principal*': 'SI',
    ...overrides,
  };
}

function workbook(
  overrides: Partial<ParsedImportWorkbook> = {},
): ParsedImportWorkbook {
  return {
    units: [unitRow()],
    people: [personRow()],
    ownerships: [ownershipRow()],
    ...overrides,
  };
}

function emptyContext(): ImportBatchContext {
  return {
    existingUnits: [],
    existingGroups: [],
    existingOwnershipsByUnitIdentifier: new Map(),
  };
}

describe('ImportUnitsUseCase', () => {
  let reader: jest.Mocked<SpreadsheetReaderPort>;
  let repo: jest.Mocked<ImportBatchRepository>;
  let useCase: ImportUnitsUseCase;

  beforeEach(() => {
    reader = {
      parseImportWorkbook: jest.fn(),
      parseCoefficientsWorkbook: jest.fn(),
      parseBalancesWorkbook: jest.fn(),
    };
    repo = {
      loadContext: jest.fn(),
      findPersonsByDocumentNumbers: jest.fn(),
      persist: jest.fn(),
    };
    repo.loadContext.mockResolvedValue(emptyContext());
    repo.findPersonsByDocumentNumbers.mockResolvedValue([]);
    reader.parseImportWorkbook.mockResolvedValue(workbook());
    useCase = new ImportUnitsUseCase(reader, repo);
  });

  const baseCommand = (
    overrides: Partial<ImportUnitsCommand> = {},
  ): ImportUnitsCommand => ({
    communityId: 'community-1',
    fileBuffer: Buffer.from(''),
    originalFileName: 'carga.xlsx',
    commit: false,
    ...overrides,
  });

  it('rejects files that are not .xlsx before parsing', async () => {
    await expect(
      useCase.execute(baseCommand({ originalFileName: 'carga.csv' })),
    ).rejects.toThrow(UnsupportedFileTypeError);
    expect(reader.parseImportWorkbook).not.toHaveBeenCalled();
  });

  it('previews a valid workbook without persisting anything', async () => {
    const result = await useCase.execute(baseCommand({ commit: false }));

    expect(result.committed).toBe(false);
    expect(result.errors).toEqual([]);
    expect(result.totalUnits).toBe(1);
    expect(result.totalPersons).toBe(1);
    expect(result.totalOwnerships).toBe(1);
    expect(repo.persist).not.toHaveBeenCalled();
  });

  it('commits a valid workbook in a single batch', async () => {
    const result = await useCase.execute(baseCommand({ commit: true }));

    expect(result.committed).toBe(true);
    expect(result.errors).toEqual([]);
    expect(repo.persist).toHaveBeenCalledTimes(1);
    const batch = repo.persist.mock.calls[0][0];
    expect(batch.units).toHaveLength(1);
    expect(batch.personsToCreate).toHaveLength(1);
    expect(batch.ownerships).toHaveLength(1);
    expect(batch.groupsToCreate).toHaveLength(0);
  });

  it('reuses an existing person by document number instead of recreating it', async () => {
    repo.findPersonsByDocumentNumbers.mockResolvedValue([
      new Person('person-1', 'NATURAL', 'CC', '123', 'Juan Perez'),
    ]);

    const result = await useCase.execute(baseCommand({ commit: true }));

    expect(result.totalPersons).toBe(0);
    const batch = repo.persist.mock.calls[0][0];
    expect(batch.personsToCreate).toHaveLength(0);
    expect(batch.ownerships[0].personId).toBe('person-1');
  });

  it('collects a row error when a required unit field is missing, and does not persist', async () => {
    reader.parseImportWorkbook.mockResolvedValue(
      workbook({ units: [unitRow({ 'area_privada_m2*': null })] }),
    );

    const result = await useCase.execute(baseCommand({ commit: false }));
    expect(result.errors).toContainEqual(
      expect.objectContaining({ sheet: 'Unidades', row: 2 }),
    );

    await expect(
      useCase.execute(baseCommand({ commit: true })),
    ).rejects.toThrow(ImportValidationError);
    expect(repo.persist).not.toHaveBeenCalled();
  });

  it('rejects a duplicate identificador within the same sheet', async () => {
    reader.parseImportWorkbook.mockResolvedValue(
      workbook({
        units: [
          unitRow({ 'area_privada_m2*': 25 }),
          unitRow({ 'area_privada_m2*': 25 }),
        ],
      }),
    );

    const result = await useCase.execute(baseCommand({ commit: false }));
    expect(
      result.errors.some((e) => e.message.includes('identificador duplicado')),
    ).toBe(true);
  });

  it('rejects a Propietarios row referencing an unknown unit identifier', async () => {
    reader.parseImportWorkbook.mockResolvedValue(
      workbook({
        ownerships: [ownershipRow({ 'identificador_unidad*': 'No Existe' })],
      }),
    );

    const result = await useCase.execute(baseCommand({ commit: false }));
    expect(
      result.errors.some(
        (e) => e.sheet === 'Propietarios' && e.message.includes('no existe'),
      ),
    ).toBe(true);
  });

  it('rejects a Propietarios row referencing an unknown person document number', async () => {
    reader.parseImportWorkbook.mockResolvedValue(
      workbook({
        ownerships: [ownershipRow({ 'numero_documento_persona*': '999' })],
      }),
    );

    const result = await useCase.execute(baseCommand({ commit: false }));
    expect(
      result.errors.some(
        (e) =>
          e.sheet === 'Propietarios' && e.message.includes("documento '999'"),
      ),
    ).toBe(true);
  });

  it('rejects when ownership percentages for a unit do not sum to 100%', async () => {
    reader.parseImportWorkbook.mockResolvedValue(
      workbook({
        people: [
          personRow({ 'numero_documento*': '123' }),
          personRow({ 'numero_documento*': '456' }),
        ],
        ownerships: [
          ownershipRow({
            'numero_documento_persona*': '123',
            'porcentaje_propiedad*': 40,
          }),
          ownershipRow({
            'numero_documento_persona*': '456',
            'porcentaje_propiedad*': 40,
            'es_principal*': 'NO',
          }),
        ],
      }),
    );

    const result = await useCase.execute(baseCommand({ commit: false }));
    expect(
      result.errors.some(
        (e) =>
          e.sheet === 'Propietarios' &&
          e.row === 0 &&
          e.message.includes('porcentaje_propiedad'),
      ),
    ).toBe(true);
  });
});
