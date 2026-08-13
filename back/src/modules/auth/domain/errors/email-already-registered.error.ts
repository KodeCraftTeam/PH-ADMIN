import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class EmailAlreadyRegisteredError extends DomainError {
  constructor(email: string) {
    super(`El correo electrónico ${email} ya está registrado`);
  }
}
