import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class InvalidActivationStateError extends DomainError {
  constructor(currentStatus: string) {
    super(`El estado de activación no es válido: ${currentStatus}`, 400);
  }
}
