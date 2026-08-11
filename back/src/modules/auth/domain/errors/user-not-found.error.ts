import { DomainError } from '../../../../shared/domain/errors/domain-error';

export class UserNotFoundError extends DomainError {
  constructor(email: string) {
    super(`User with email ${email} not found`, 404, 'USER_NOT_FOUND');
  }
}
