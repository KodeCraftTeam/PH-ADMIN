import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class UserNotFoundError extends DomainError {
  constructor(email: string) {
    super(
      `El usuario con correo ${email} no se ha encontrado`,
      404,
      'USER_NOT_FOUND',
    );
  }
}
