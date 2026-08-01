import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class TaxIdAlreadyRegisteredError extends DomainError {
  constructor(taxId: string) {
    super(`Tax ID already registered: ${taxId}`, 409);
  }
}
