import { Injectable, Logger } from '@nestjs/common';
import { NotificationPort } from '../../../../domain/ports/out/notification.port';

/**
 * Outbound adapter: console-based notifications.
 * Placeholder until a real email provider (SES, SendGrid…) is integrated.
 */
@Injectable()
export class ConsoleNotificationAdapter implements NotificationPort {
  private readonly logger = new Logger('Notifications');

  async inviteOwners(propertyId: string): Promise<void> {
    this.logger.log(`[stub] Inviting owners of property ${propertyId}`);
  }

  async alertSupport(propertyId: string, reason: string): Promise<void> {
    this.logger.warn(`[stub] Support alert — property ${propertyId}: ${reason}`);
  }
}
