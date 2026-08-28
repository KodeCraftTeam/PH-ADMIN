import { Inject, Injectable } from '@nestjs/common';
import { ImportCoefficientsCommand } from '../dto/import-coefficients.dto';
import {
  CoefficientPreviewRow,
  ImportCoefficientsResult,
} from '../read-models/import-coefficients-result.read-model';
import { CoefficientImportRowError } from '../../domain/errors/coefficient-import-row-error';
import {
  SPREADSHEET_READER_PORT,
  type SpreadsheetReaderPort,
  type RawSheetRow,
} from '../ports/out/spreadsheet-reader.port';
import {
  COEFFICIENT_REPOSITORY,
  type CoefficientRepository,
  type CoefficientUpdate,
} from '../../domain/ports/out/coefficient.repository';
import { Property } from '../../domain/entities/property.entity';
import {
  Coefficient,
  CoefficientOrigin,
} from '../../domain/value-objects/coefficient.vo';
import { CoefficientImportValidationError } from '../../domain/errors/coefficient-import-validation.error';
import { UnsupportedFileTypeError } from '../../domain/errors/unsupported-file-type.error';

const COEFFICIENT_ORIGINS: CoefficientOrigin[] = ['CALCULADO', 'REGLAMENTO'];

function asString(value: unknown): string | null {
  if (
    typeof value !== 'string' &&
    typeof value !== 'number' &&
    typeof value !== 'boolean'
  ) {
    return null;
  }
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const n = Number(value.replace(',', '.').trim());
  return Number.isFinite(n) ? n : null;
}

function rowError(row: number, message: string): CoefficientImportRowError {
  return { sheet: 'Coeficientes', row, message };
}

/**
 * Use case: importación de Coeficientes (paso separado del import de
 * unidades — ver ADR informal en la conversación de onboarding: el
 * coeficiente de una Unit puede llegar después de crearla, por eso
 * Unit.coefficient es nullable). Requiere que las unidades ya existan en
 * la copropiedad. Reutiliza Property.assertCoefficientsComplete contra el
 * estado FINAL (existentes + este batch) antes de persistir.
 */
@Injectable()
export class ImportCoefficientsUseCase {
  constructor(
    @Inject(SPREADSHEET_READER_PORT)
    private readonly reader: SpreadsheetReaderPort,
    @Inject(COEFFICIENT_REPOSITORY)
    private readonly repo: CoefficientRepository,
  ) {}

  async execute(
    command: ImportCoefficientsCommand,
  ): Promise<ImportCoefficientsResult> {
    if (!command.originalFileName.toLowerCase().endsWith('.xlsx')) {
      throw new UnsupportedFileTypeError(command.originalFileName);
    }

    const rows = await this.reader.parseCoefficientsWorkbook(
      command.fileBuffer,
    );
    const units = await this.repo.loadUnitsForCoefficients(command.communityId);
    const unitByIdentifier = new Map(units.map((u) => [u.identifier, u]));

    const errors: CoefficientImportRowError[] = [];
    const seenIdentifiers = new Set<string>();
    const updates: CoefficientUpdate[] = [];
    const preview: CoefficientPreviewRow[] = [];

    rows.forEach((raw: RawSheetRow, index) => {
      const row = index + 2;
      const identifier = asString(raw['identificador_unidad*']);
      const coefficientRaw = asNumber(raw['coeficiente*']);
      const originRaw = asString(raw['origen']);

      if (!identifier) {
        errors.push(rowError(row, 'identificador_unidad es obligatorio'));
        return;
      }
      const unit = unitByIdentifier.get(identifier);
      if (!unit) {
        errors.push(
          rowError(
            row,
            `la unidad '${identifier}' no existe en la copropiedad`,
          ),
        );
        return;
      }
      if (seenIdentifiers.has(identifier)) {
        errors.push(
          rowError(row, `identificador_unidad duplicado: '${identifier}'`),
        );
        return;
      }
      if (coefficientRaw === null) {
        errors.push(rowError(row, 'coeficiente es obligatorio'));
        return;
      }
      let origin: CoefficientOrigin = 'CALCULADO';
      if (originRaw) {
        const o = originRaw.toUpperCase() as CoefficientOrigin;
        if (!COEFFICIENT_ORIGINS.includes(o)) {
          errors.push(
            rowError(
              row,
              `origen inválido: '${originRaw}'. Valores válidos: ${COEFFICIENT_ORIGINS.join(', ')}`,
            ),
          );
          return;
        }
        origin = o;
      }

      let coefficient: Coefficient;
      try {
        coefficient = Coefficient.create(coefficientRaw, origin);
      } catch (e) {
        errors.push(rowError(row, (e as Error).message));
        return;
      }

      seenIdentifiers.add(identifier);
      updates.push({ unitId: unit.id, coefficient });
      preview.push({
        identifier,
        coefficient: coefficient.percentage,
        origin: coefficient.origin,
      });
    });

    const updatedByUnitId = new Map(
      updates.map((u) => [u.unitId, u.coefficient]),
    );
    const finalCoefficients = units.map(
      (u) => updatedByUnitId.get(u.id) ?? u.coefficient,
    );
    try {
      Property.assertCoefficientsComplete(finalCoefficients);
    } catch (e) {
      errors.push(rowError(0, (e as Error).message));
    }

    if (command.commit) {
      if (errors.length > 0) throw new CoefficientImportValidationError(errors);
      await this.repo.updateCoefficients(updates);
    }

    const coefficientSum = finalCoefficients
      .filter((c): c is Coefficient => c !== null)
      .reduce((acc, c) => acc + c.percentage, 0);

    return {
      committed: command.commit && errors.length === 0,
      totalUpdated: updates.length,
      coefficientSum: Number(coefficientSum.toFixed(2)),
      errors,
      coefficients: preview,
    };
  }
}
