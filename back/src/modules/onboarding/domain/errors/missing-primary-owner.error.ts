import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class MissingPrimaryOwnerError extends DomainError {
  constructor(unitIdentifier: string) {
    super(
      `La unidad '${unitIdentifier}' no tiene ningún propietario marcado como es_principal`,
      400,
    );
  }
}
