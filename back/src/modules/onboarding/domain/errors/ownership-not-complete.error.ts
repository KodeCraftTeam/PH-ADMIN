import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class OwnershipNotCompleteError extends DomainError {
  constructor(unitIdentifier: string, sum: number) {
    super(
      `La suma de porcentaje_propiedad para la unidad '${unitIdentifier}' debe ser 100% (actual: ${sum.toFixed(2)}%)`,
      400,
    );
  }
}
