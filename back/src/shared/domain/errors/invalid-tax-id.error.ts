import { DomainError } from './domain-error';

export class InvalidTaxIdError extends DomainError {
  constructor(value: string) {
    super(`El NIT no es válido: ${value}`, 400, 'INVALID_TAX_ID');
  }
}
