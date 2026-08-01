import { DomainError } from './domain-error';

export class InvalidTaxIdError extends DomainError {
  constructor(value: string) {
    super(`Invalid tax ID: ${value}`);
  }
}
