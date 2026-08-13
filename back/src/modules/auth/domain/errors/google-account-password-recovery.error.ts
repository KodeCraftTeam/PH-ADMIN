import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class GoogleAccountPasswordRecoveryError extends DomainError {
  constructor(email: string) {
    super(
      `No se pudo recuperar la contraseña de la cuenta de Google con correo ${email}`,
      409,
      'GOOGLE_ACCOUNT_PASSWORD_RECOVERY',
    );
  }
}
