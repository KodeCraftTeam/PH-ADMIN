import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class CoefficientsNotCompleteError extends DomainError {
  constructor(sum: number) {
    super(
      `La suma de coeficientes de la copropiedad debe ser 100% (actual: ${sum.toFixed(2)}%)`,
      400,
    );
  }
}
