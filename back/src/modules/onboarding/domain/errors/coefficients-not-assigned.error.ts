import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class CoefficientsNotAssignedError extends DomainError {
  constructor(missingCount: number) {
    super(
      `${missingCount} unidad(es) de la copropiedad aún no tienen coeficiente asignado`,
      400,
    );
  }
}
