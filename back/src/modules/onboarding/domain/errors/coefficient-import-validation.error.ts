import { DomainError } from '../../../../shared/domain/errors/domain-error';
import { CoefficientImportRowError } from './coefficient-import-row-error';

export class CoefficientImportValidationError extends DomainError {
  constructor(rowErrors: CoefficientImportRowError[]) {
    super(
      'El archivo tiene errores de validación. No se importó ningún coeficiente.',
      422,
      undefined,
      rowErrors,
    );
  }
}
