import { DomainError } from './domain-error';

export class EmailDeliveryError extends DomainError {
  constructor() {
    super(
      'No pudimos enviar el correo de recuperación. Intenta de nuevo en unos minutos.',
      503,
      'EMAIL_DELIVERY_FAILED',
    );
  }
}
