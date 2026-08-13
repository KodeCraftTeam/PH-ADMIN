import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class InvalidVerificationCodeError extends DomainError {
  constructor() {
    super('Código de verificación inválido', 401);
  }
}
