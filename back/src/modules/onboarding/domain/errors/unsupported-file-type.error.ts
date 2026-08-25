import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class UnsupportedFileTypeError extends DomainError {
  constructor(fileName: string) {
    super(
      `Tipo de archivo no soportado: ${fileName}. Solo se admite .xlsx`,
      400,
    );
  }
}
