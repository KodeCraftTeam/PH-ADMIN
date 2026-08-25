import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class OwnershipPercentageOutOfRangeError extends DomainError {
  constructor(percentage: number) {
    super(
      `El porcentaje de propiedad debe estar entre 0 y 100: ${percentage}`,
      400,
    );
  }
}
