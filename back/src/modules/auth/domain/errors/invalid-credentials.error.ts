import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Credenciales inválidas', 401);
  }
}
