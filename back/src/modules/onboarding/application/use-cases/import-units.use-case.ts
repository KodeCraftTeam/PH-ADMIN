import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ImportUnitsCommand } from '../dto/import-units.dto';
import {
  ImportPreviewRow,
  ImportResult,
} from '../read-models/import-result.read-model';
import { ImportRowError } from '../../domain/errors/import-row-error';
import {
  SPREADSHEET_READER_PORT,
  type SpreadsheetReaderPort,
  type RawSheetRow,
} from '../ports/out/spreadsheet-reader.port';
import {
  IMPORT_BATCH_REPOSITORY,
  type ImportBatchRepository,
  type ImportBatchContext,
} from '../../domain/ports/out/import-batch.repository';
import {
  Unit,
  UnitType,
  UnitUse,
  UnitOwnershipRow,
} from '../../domain/entities/unit.entity';
import {
  UnitGroup,
  UnitGroupType,
} from '../../domain/entities/unit-group.entity';
import {
  Person,
  PersonType,
  DocumentType,
} from '../../domain/entities/person.entity';
import { PropertyOwnership } from '../../domain/entities/property-ownership.entity';
import { OwnershipPercentage } from '../../domain/value-objects/ownership-percentage.vo';
import { ImportValidationError } from '../../domain/errors/import-validation.error';
import { UnsupportedFileTypeError } from '../../domain/errors/unsupported-file-type.error';

const UNIT_TYPES: UnitType[] = [
  'APARTAMENTO',
  'CASA',
  'LOCAL',
  'PARQUEADERO',
  'DEPOSITO',
];
const GROUP_TYPES: UnitGroupType[] = ['TORRE', 'MANZANA', 'ETAPA', 'SECTOR'];
const UNIT_USES: UnitUse[] = ['RESIDENCIAL', 'COMERCIAL', 'MIXTO'];
const PERSON_TYPES: PersonType[] = ['NATURAL', 'JURIDICA'];
const DOCUMENT_TYPES: DocumentType[] = ['CC', 'CE', 'NIT', 'PASAPORTE'];

function stringify(value: string | number | boolean): string {
  return typeof value === 'string' ? value : String(value);
}

function asString(value: unknown): string | null {
  if (
    typeof value !== 'string' &&
    typeof value !== 'number' &&
    typeof value !== 'boolean'
  ) {
    return null;
  }
  const text = stringify(value).trim();
  return text.length > 0 ? text : null;
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const n = Number(value.replace(',', '.').trim());
  return Number.isFinite(n) ? n : null;
}

function asInt(value: unknown): number | null {
  const n = asNumber(value);
  return n === null ? null : Math.trunc(n);
}

function asDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function asBoolean(value: unknown): boolean | null {
  const text = asString(value)?.toUpperCase() ?? null;
  if (text === null) return null;
  if (['SI', 'SÍ', 'TRUE', '1', 'YES'].includes(text)) return true;
  if (['NO', 'FALSE', '0'].includes(text)) return false;
  return null;
}

function rowError(
  sheet: ImportRowError['sheet'],
  row: number,
  message: string,
): ImportRowError {
  return { sheet, row, message };
}

interface PendingUnitRow {
  row: number;
  identifier: string;
  type: UnitType;
  floor: number | null;
  area: number;
  matricula: string | null;
  use: UnitUse | null;
  groupName: string | null;
  groupType: UnitGroupType | null;
}

interface PendingPersonRow {
  row: number;
  personType: PersonType;
  documentType: DocumentType;
  documentNumber: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  notificationAddress: string | null;
}

interface PendingOwnershipRow {
  row: number;
  unitIdentifier: string;
  personDocumentNumber: string;
  percentage: OwnershipPercentage;
  startDate: Date;
  isPrimary: boolean;
}

/**
 * Use case: importación masiva de Unidades, Personas y Propietarios
 * (pasos 2-3 del onboarding). Valida las 3 hojas del Excel de punta a punta
 * y, si commit=true y no hay errores, persiste todo en una única transacción
 * (regla del negocio: si cualquier hoja falla, no se inserta nada).
 */
@Injectable()
export class ImportUnitsUseCase {
  constructor(
    @Inject(SPREADSHEET_READER_PORT)
    private readonly reader: SpreadsheetReaderPort,
    @Inject(IMPORT_BATCH_REPOSITORY)
    private readonly repo: ImportBatchRepository,
  ) {}

  async execute(command: ImportUnitsCommand): Promise<ImportResult> {
    if (!command.originalFileName.toLowerCase().endsWith('.xlsx')) {
      throw new UnsupportedFileTypeError(command.originalFileName);
    }

    const workbook = await this.reader.parseImportWorkbook(command.fileBuffer);
    const context = await this.repo.loadContext(command.communityId);
    const errors: ImportRowError[] = [];

    const pendingUnits = this.parseUnitRows(workbook.units, context, errors);
    const { groupsToCreate, groupNameToId } = this.resolveGroups(
      command.communityId,
      pendingUnits,
      context,
      errors,
    );
    const { units, preview } = this.buildUnits(
      command.communityId,
      pendingUnits,
      groupNameToId,
    );

    const pendingPersons = this.parsePersonRows(workbook.people, errors);
    const dbPersons = await this.repo.findPersonsByDocumentNumbers(
      pendingPersons.map((p) => p.documentNumber),
    );
    const dbPersonByDocument = new Map(
      dbPersons.map((p) => [p.documentNumber, p]),
    );

    const personsToCreate = pendingPersons
      .filter((p) => !dbPersonByDocument.has(p.documentNumber))
      .map(
        (p) =>
          new Person(
            randomUUID(),
            p.personType,
            p.documentType,
            p.documentNumber,
            p.fullName,
            p.email,
            p.phone,
            p.notificationAddress,
          ),
      );

    const unitIdByIdentifier = new Map<string, string>();
    for (const u of context.existingUnits)
      unitIdByIdentifier.set(u.identifier, u.id);
    for (const u of units) unitIdByIdentifier.set(u.identifier, u.id);

    const personIdByDocument = new Map<string, string>();
    for (const p of dbPersons) personIdByDocument.set(p.documentNumber, p.id);
    for (const p of personsToCreate)
      personIdByDocument.set(p.documentNumber, p.id);

    const pendingOwnerships = this.parseOwnershipRows(
      workbook.ownerships,
      errors,
      unitIdByIdentifier,
      personIdByDocument,
      context,
    );

    const ownerships = pendingOwnerships.map(
      (o) =>
        new PropertyOwnership(
          randomUUID(),
          unitIdByIdentifier.get(o.unitIdentifier)!,
          personIdByDocument.get(o.personDocumentNumber)!,
          o.percentage,
          o.startDate,
          o.isPrimary,
        ),
    );

    if (command.commit) {
      if (errors.length > 0) throw new ImportValidationError(errors);

      await this.repo.persist({
        communityId: command.communityId,
        groupsToCreate,
        units,
        personsToCreate,
        ownerships,
      });
    }

    return {
      committed: command.commit && errors.length === 0,
      totalUnits: units.length,
      totalPersons: personsToCreate.length,
      totalOwnerships: ownerships.length,
      errors,
      units: preview,
    };
  }

  private parseUnitRows(
    rows: RawSheetRow[],
    context: ImportBatchContext,
    errors: ImportRowError[],
  ): PendingUnitRow[] {
    const pending: PendingUnitRow[] = [];
    const existingIdentifiers = new Set(
      context.existingUnits.map((u) => u.identifier),
    );
    const existingMatriculas = new Set(
      context.existingUnits
        .map((u) => u.propertyRegistrationNumber)
        .filter((m): m is string => !!m),
    );
    const batchIdentifiers = new Set<string>();
    const batchMatriculas = new Set<string>();

    rows.forEach((raw, index) => {
      const row = index + 2;
      const identifier = asString(raw['identificador*']);
      const typeRaw = asString(raw['tipo*']);
      const groupName = asString(raw['agrupador_nombre']);
      const groupTypeRaw = asString(raw['agrupador_tipo']);
      const floor = asInt(raw['piso']);
      const area = asNumber(raw['area_privada_m2*']);
      const matricula = asString(raw['matricula_inmobiliaria']);
      const useRaw = asString(raw['uso']);

      if (!identifier) {
        errors.push(rowError('Unidades', row, 'identificador es obligatorio'));
        return;
      }
      if (
        existingIdentifiers.has(identifier) ||
        batchIdentifiers.has(identifier)
      ) {
        errors.push(
          rowError('Unidades', row, `identificador duplicado: '${identifier}'`),
        );
        return;
      }
      if (!typeRaw) {
        errors.push(rowError('Unidades', row, 'tipo es obligatorio'));
        return;
      }
      const type = typeRaw.toUpperCase() as UnitType;
      if (!UNIT_TYPES.includes(type)) {
        errors.push(
          rowError(
            'Unidades',
            row,
            `tipo inválido: '${typeRaw}'. Valores válidos: ${UNIT_TYPES.join(', ')}`,
          ),
        );
        return;
      }
      if (area === null || area <= 0) {
        errors.push(
          rowError(
            'Unidades',
            row,
            'area_privada_m2 es obligatoria y debe ser mayor a 0',
          ),
        );
        return;
      }
      let groupType: UnitGroupType | null = null;
      if (groupName && !groupTypeRaw) {
        errors.push(
          rowError(
            'Unidades',
            row,
            `agrupador_tipo es obligatorio cuando se especifica agrupador_nombre ('${groupName}')`,
          ),
        );
        return;
      }
      if (groupTypeRaw) {
        const gt = groupTypeRaw.toUpperCase() as UnitGroupType;
        if (!GROUP_TYPES.includes(gt)) {
          errors.push(
            rowError(
              'Unidades',
              row,
              `agrupador_tipo inválido: '${groupTypeRaw}'. Valores válidos: ${GROUP_TYPES.join(', ')}`,
            ),
          );
          return;
        }
        groupType = gt;
      }
      let use: UnitUse | null = null;
      if (useRaw) {
        const u = useRaw.toUpperCase() as UnitUse;
        if (!UNIT_USES.includes(u)) {
          errors.push(
            rowError(
              'Unidades',
              row,
              `uso inválido: '${useRaw}'. Valores válidos: ${UNIT_USES.join(', ')}`,
            ),
          );
          return;
        }
        use = u;
      }
      if (
        matricula &&
        (existingMatriculas.has(matricula) || batchMatriculas.has(matricula))
      ) {
        errors.push(
          rowError(
            'Unidades',
            row,
            `matricula_inmobiliaria duplicada: '${matricula}'`,
          ),
        );
        return;
      }

      batchIdentifiers.add(identifier);
      if (matricula) batchMatriculas.add(matricula);

      pending.push({
        row,
        identifier,
        type,
        floor,
        area,
        matricula,
        use,
        groupName,
        groupType,
      });
    });

    return pending;
  }

  private resolveGroups(
    communityId: string,
    pending: PendingUnitRow[],
    context: ImportBatchContext,
    errors: ImportRowError[],
  ): { groupsToCreate: UnitGroup[]; groupNameToId: Map<string, string> } {
    const groupNameToId = new Map<string, string>();
    for (const g of context.existingGroups) groupNameToId.set(g.name, g.id);

    const groupNameToType = new Map<string, UnitGroupType>();
    for (const r of pending) {
      if (!r.groupName || !r.groupType) continue;
      const prevType = groupNameToType.get(r.groupName);
      if (prevType && prevType !== r.groupType) {
        errors.push(
          rowError(
            'Unidades',
            r.row,
            `agrupador '${r.groupName}' tiene tipos distintos en el archivo ('${prevType}' vs '${r.groupType}')`,
          ),
        );
        continue;
      }
      groupNameToType.set(r.groupName, r.groupType);
    }

    const groupsToCreate: UnitGroup[] = [];
    for (const [name, type] of groupNameToType) {
      if (!groupNameToId.has(name)) {
        const group = new UnitGroup(randomUUID(), communityId, name, type);
        groupsToCreate.push(group);
        groupNameToId.set(name, group.id);
      }
    }

    return { groupsToCreate, groupNameToId };
  }

  private buildUnits(
    communityId: string,
    pending: PendingUnitRow[],
    groupNameToId: Map<string, string>,
  ): { units: Unit[]; preview: ImportPreviewRow[] } {
    const units: Unit[] = [];
    const preview: ImportPreviewRow[] = [];

    for (const r of pending) {
      const groupId = r.groupName
        ? (groupNameToId.get(r.groupName) ?? null)
        : null;
      const unit = new Unit(
        randomUUID(),
        communityId,
        r.identifier,
        r.type,
        r.area,
        null,
        groupId,
        r.floor,
        r.matricula,
        r.use,
      );
      units.push(unit);
      preview.push({
        identifier: unit.identifier,
        type: unit.type,
        group: r.groupName,
        floor: unit.floor,
        areaM2: unit.privateAreaM2,
        matricula: unit.propertyRegistrationNumber,
        use: unit.use,
      });
    }

    return { units, preview };
  }

  private parsePersonRows(
    rows: RawSheetRow[],
    errors: ImportRowError[],
  ): PendingPersonRow[] {
    const pending: PendingPersonRow[] = [];
    const batchDocumentNumbers = new Set<string>();

    rows.forEach((raw, index) => {
      const row = index + 2;
      const documentTypeRaw = asString(raw['tipo_documento*']);
      const documentNumber = asString(raw['numero_documento*']);
      const fullName = asString(raw['nombre_razon_social*']);
      const personTypeRaw = asString(raw['tipo_persona*']);
      const email = asString(raw['email']);
      const phone = asString(raw['telefono']);
      const notificationAddress = asString(raw['direccion_notificacion']);

      if (!documentTypeRaw) {
        errors.push(rowError('Personas', row, 'tipo_documento es obligatorio'));
        return;
      }
      const documentType = documentTypeRaw.toUpperCase() as DocumentType;
      if (!DOCUMENT_TYPES.includes(documentType)) {
        errors.push(
          rowError(
            'Personas',
            row,
            `tipo_documento inválido: '${documentTypeRaw}'. Valores válidos: ${DOCUMENT_TYPES.join(', ')}`,
          ),
        );
        return;
      }
      if (!documentNumber) {
        errors.push(
          rowError('Personas', row, 'numero_documento es obligatorio'),
        );
        return;
      }
      if (batchDocumentNumbers.has(documentNumber)) {
        errors.push(
          rowError(
            'Personas',
            row,
            `numero_documento duplicado dentro del archivo: '${documentNumber}'`,
          ),
        );
        return;
      }
      if (!fullName) {
        errors.push(
          rowError('Personas', row, 'nombre_razon_social es obligatorio'),
        );
        return;
      }
      if (!personTypeRaw) {
        errors.push(rowError('Personas', row, 'tipo_persona es obligatorio'));
        return;
      }
      const personType = personTypeRaw.toUpperCase() as PersonType;
      if (!PERSON_TYPES.includes(personType)) {
        errors.push(
          rowError(
            'Personas',
            row,
            `tipo_persona inválido: '${personTypeRaw}'. Valores válidos: ${PERSON_TYPES.join(', ')}`,
          ),
        );
        return;
      }

      batchDocumentNumbers.add(documentNumber);
      pending.push({
        row,
        personType,
        documentType,
        documentNumber,
        fullName,
        email,
        phone,
        notificationAddress,
      });
    });

    return pending;
  }

  private parseOwnershipRows(
    rows: RawSheetRow[],
    errors: ImportRowError[],
    knownUnitIds: Map<string, string>,
    knownPersonIds: Map<string, string>,
    context: ImportBatchContext,
  ): PendingOwnershipRow[] {
    const pending: PendingOwnershipRow[] = [];

    rows.forEach((raw, index) => {
      const row = index + 2;
      const unitIdentifier = asString(raw['identificador_unidad*']);
      const personDocumentNumber = asString(raw['numero_documento_persona*']);
      const percentageRaw = asNumber(raw['porcentaje_propiedad*']);
      const startDate = asDate(raw['fecha_inicio*']);
      const isPrimary = asBoolean(raw['es_principal*']);

      if (!unitIdentifier) {
        errors.push(
          rowError('Propietarios', row, 'identificador_unidad es obligatorio'),
        );
        return;
      }
      if (!knownUnitIds.has(unitIdentifier)) {
        errors.push(
          rowError(
            'Propietarios',
            row,
            `la unidad '${unitIdentifier}' no existe (ni en este archivo ni en la copropiedad)`,
          ),
        );
        return;
      }
      if (!personDocumentNumber) {
        errors.push(
          rowError(
            'Propietarios',
            row,
            'numero_documento_persona es obligatorio',
          ),
        );
        return;
      }
      if (!knownPersonIds.has(personDocumentNumber)) {
        errors.push(
          rowError(
            'Propietarios',
            row,
            `la persona con documento '${personDocumentNumber}' no existe (ni en este archivo ni en el sistema)`,
          ),
        );
        return;
      }
      if (percentageRaw === null) {
        errors.push(
          rowError('Propietarios', row, 'porcentaje_propiedad es obligatorio'),
        );
        return;
      }
      let percentage: OwnershipPercentage;
      try {
        percentage = OwnershipPercentage.create(percentageRaw);
      } catch (e) {
        errors.push(rowError('Propietarios', row, (e as Error).message));
        return;
      }
      if (!startDate) {
        errors.push(
          rowError(
            'Propietarios',
            row,
            'fecha_inicio es obligatoria y debe ser una fecha válida',
          ),
        );
        return;
      }
      if (isPrimary === null) {
        errors.push(
          rowError('Propietarios', row, 'es_principal es obligatorio (SI/NO)'),
        );
        return;
      }

      pending.push({
        row,
        unitIdentifier,
        personDocumentNumber,
        percentage,
        startDate,
        isPrimary,
      });
    });

    const byUnit = new Map<string, PendingOwnershipRow[]>();
    for (const o of pending) {
      const list = byUnit.get(o.unitIdentifier) ?? [];
      list.push(o);
      byUnit.set(o.unitIdentifier, list);
    }

    for (const [unitIdentifier, list] of byUnit) {
      const existing =
        context.existingOwnershipsByUnitIdentifier.get(unitIdentifier) ?? [];
      const allOwnerships: UnitOwnershipRow[] = [
        ...existing.map((e) => ({
          percentage: OwnershipPercentage.create(e.percentage),
          isPrimary: e.isPrimary,
        })),
        ...list.map((o) => ({
          percentage: o.percentage,
          isPrimary: o.isPrimary,
        })),
      ];
      try {
        Unit.assertOwnershipsComplete(unitIdentifier, allOwnerships);
      } catch (e) {
        errors.push(rowError('Propietarios', 0, (e as Error).message));
      }
    }

    return pending;
  }
}
