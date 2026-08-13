import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class CoefficientOutOfRangeError extends DomainError {
  constructor(percentage: number) {
    super(`El coeficiente debe estar entre 0 y 100: ${percentage}`, 400);
  }
}
