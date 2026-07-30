import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class CoefficientOutOfRangeError extends DomainError {
  constructor(percentage: number) {
    super(`Coefficient out of range: ${percentage}`);
  }
}
