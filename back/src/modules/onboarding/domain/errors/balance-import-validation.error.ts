import { DomainError } from '../../../../shared/domain/errors/domain-error';
import { BalanceImportRowIssue } from './balance-import-row-error';

export class BalanceImportValidationError extends DomainError {
  constructor(rowErrors: BalanceImportRowIssue[]) {
    super(
      'El archivo tiene errores de validación. No se importó ningún saldo.',
      422,
      undefined,
      rowErrors,
    );
  }
}
