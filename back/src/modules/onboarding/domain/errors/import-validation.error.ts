import { DomainError } from '../../../../shared/domain/errors/domain-error';
import { ImportRowError } from './import-row-error';

export class ImportValidationError extends DomainError {
  constructor(rowErrors: ImportRowError[]) {
    super(
      'El archivo tiene errores de validación. No se importó ningún dato.',
      422,
      undefined,
      rowErrors,
    );
  }
}
