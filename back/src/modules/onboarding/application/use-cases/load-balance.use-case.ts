import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ImportBalancesCommand } from '../dto/import-balances.dto';
import {
  BalancePreviewRow,
  ImportBalancesResult,
} from '../read-models/import-balances-result.read-model';
import { BalanceImportRowIssue } from '../../domain/errors/balance-import-row-error';
import { BalanceImportValidationError } from '../../domain/errors/balance-import-validation.error';
import { UnsupportedFileTypeError } from '../../domain/errors/unsupported-file-type.error';
import {
  SPREADSHEET_READER_PORT,
  type SpreadsheetReaderPort,
  type RawSheetRow,
} from '../ports/out/spreadsheet-reader.port';
import {
  BALANCE_REPOSITORY,
  type BalanceRepository,
} from '../../domain/ports/out/balance.repository';
import {
  BalanceStatus,
  InitialBalance,
} from '../../domain/entities/balance.entity';

const BALANCE_STATUSES: BalanceStatus[] = [
  'AL_DIA',
  'EN_MORA',
  'ACUERDO_DE_PAGO',
];

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

function asDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function issue(row: number, message: string): BalanceImportRowIssue {
  return { sheet: 'Saldos', row, message };
}

/**
 * Use case: step 5 of onboarding — saldos iniciales por unidad.
 * InitialBalance es plano (un valor vigente por unidad, no ledger por
 * concepto — decisión ya cerrada). Independiente de coeficientes: no lee
 * ni valida unit.coefficient, solo requiere que la unidad exista.
 * Idempotente por unidad: re-subir reemplaza el saldo anterior de esa
 * unidad completo (upsert por unitId, no por fecha).
 */
@Injectable()
export class LoadBalanceUseCase {
  constructor(
    @Inject(SPREADSHEET_READER_PORT)
    private readonly reader: SpreadsheetReaderPort,
    @Inject(BALANCE_REPOSITORY)
    private readonly repo: BalanceRepository,
  ) {}

  async execute(command: ImportBalancesCommand): Promise<ImportBalancesResult> {
    if (!command.originalFileName.toLowerCase().endsWith('.xlsx')) {
      throw new UnsupportedFileTypeError(command.originalFileName);
    }

    const rows = await this.reader.parseBalancesWorkbook(command.fileBuffer);
    const units = await this.repo.loadUnitIdentifiers(command.communityId);
    const unitByIdentifier = new Map(units.map((u) => [u.identifier, u]));

    const errors: BalanceImportRowIssue[] = [];
    const warnings: BalanceImportRowIssue[] = [];
    const seenIdentifiers = new Set<string>();
    const balances: InitialBalance[] = [];
    const preview: BalancePreviewRow[] = [];

    rows.forEach((raw: RawSheetRow, index) => {
      const row = index + 2;
      const identifier = asString(raw['identificador_unidad*']);
      const balanceCOP = asNumber(raw['balance_cop*']);
      const cutoffDate = asDate(raw['fecha_corte*']);
      const statusRaw = asString(raw['status*']);

      if (!identifier) {
        errors.push(issue(row, 'identificador_unidad es obligatorio'));
        return;
      }
      const unit = unitByIdentifier.get(identifier);
      if (!unit) {
        errors.push(
          issue(row, `la unidad '${identifier}' no existe en la copropiedad`),
        );
        return;
      }
      if (seenIdentifiers.has(identifier)) {
        errors.push(
          issue(row, `identificador_unidad duplicado: '${identifier}'`),
        );
        return;
      }
      if (balanceCOP === null) {
        errors.push(issue(row, 'balance_cop es obligatorio'));
        return;
      }
      if (!cutoffDate) {
        errors.push(
          issue(row, 'fecha_corte es obligatoria y debe ser una fecha válida'),
        );
        return;
      }
      if (!statusRaw) {
        errors.push(issue(row, 'status es obligatorio'));
        return;
      }
      const status = statusRaw.toUpperCase() as BalanceStatus;
      if (!BALANCE_STATUSES.includes(status)) {
        errors.push(
          issue(
            row,
            `status inválido: '${statusRaw}'. Valores válidos: ${BALANCE_STATUSES.join(', ')}`,
          ),
        );
        return;
      }

      if (status === 'EN_MORA' && balanceCOP === 0) {
        errors.push(
          issue(row, 'una unidad EN_MORA no puede tener balance_cop en 0'),
        );
        return;
      }
      if (status === 'AL_DIA' && balanceCOP > 0) {
        warnings.push(
          issue(
            row,
            `unidad '${identifier}' marcada AL_DIA con balance_cop > 0 (${balanceCOP})`,
          ),
        );
      }

      seenIdentifiers.add(identifier);
      balances.push(
        new InitialBalance(
          randomUUID(),
          unit.id,
          balanceCOP,
          cutoffDate,
          status,
        ),
      );
      preview.push({
        identifier,
        balanceCOP,
        cutoffDate: cutoffDate.toISOString().slice(0, 10),
        status,
      });
    });

    if (command.commit) {
      if (errors.length > 0) throw new BalanceImportValidationError(errors);
      await this.repo.upsertBatch(balances);
    }

    return {
      committed: command.commit && errors.length === 0,
      totalUpserted: balances.length,
      errors,
      warnings,
      balances: preview,
    };
  }
}
