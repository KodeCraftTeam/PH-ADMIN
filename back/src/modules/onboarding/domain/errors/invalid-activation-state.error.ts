import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class InvalidActivationStateError extends DomainError {
  constructor(currentStatus: string) {
    super(`Cannot activate property in status "${currentStatus}"`);
  }
}
