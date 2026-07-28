import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid credentials', 401);
  }
}
