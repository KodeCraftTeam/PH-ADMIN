import { Injectable, Logger } from '@nestjs/common';
import { NotificationPort } from '../../../../domain/ports/out/notification.port';

@Injectable()
export class ConsoleNotificationAdapter implements NotificationPort {
  private readonly logger = new Logger('Notifications');

  async inviteOwners(propertyId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.logger.log(`[stub] Inviting owners of property ${propertyId}`);
  }

  async alertSupport(propertyId: string, reason: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.logger.warn(
      `[stub] Support alert — property ${propertyId}: ${reason}`,
    );
  }
}
