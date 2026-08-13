import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class TaxIdAlreadyRegisteredError extends DomainError {
  constructor(taxId: string) {
    super(`El NIT ${taxId} ya está registrado`, 409);
  }
}
