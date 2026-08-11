import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class GoogleAccountPasswordRecoveryError extends DomainError {
  constructor(email: string) {
    super(
      `Account registered with Google, cannot recover password: ${email}`,
      409,
      'GOOGLE_ACCOUNT_PASSWORD_RECOVERY',
    );
  }
}
