import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class InvalidVerificationCodeError extends DomainError {
  constructor() {
    super('Invalid verification code', 401);
  }
}
