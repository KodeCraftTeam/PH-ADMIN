import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class EmailAlreadyRegisteredError extends DomainError {
  constructor(email: string) {
    super(`Email already registered: ${email}`, 409);
  }
}
