import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class MultiplePrimaryOwnersError extends DomainError {
  constructor(unitIdentifier: string) {
    super(
      `La unidad '${unitIdentifier}' tiene más de un propietario marcado como es_principal`,
      400,
    );
  }
}
