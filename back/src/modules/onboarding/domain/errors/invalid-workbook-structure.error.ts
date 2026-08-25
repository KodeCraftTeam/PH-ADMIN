import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class InvalidWorkbookStructureError extends DomainError {
  constructor(missingSheets: string[]) {
    super(
      `El archivo no tiene el formato esperado. Faltan las hojas: ${missingSheets.join(', ')}`,
      400,
    );
  }
}
