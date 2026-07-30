import { Inject, Injectable } from '@nestjs/common';
import { PROPERTY_REPOSITORY } from '../../domain/ports/out/property.repository';
import type { PropertyRepository } from '../../domain/ports/out/property.repository';
import { NOTIFICATION_PORT } from '../../domain/ports/out/notification.port';
import type { NotificationPort } from '../../domain/ports/out/notification.port';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';

/**
 * Use case: step 6 — final activation of the property.
 * TODO: verify full checklist (structure, 100% valid units,
 * balance loaded) before activating and inviting owners.
 */
@Injectable()
export class ActivatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepo: PropertyRepository,
    @Inject(NOTIFICATION_PORT)
    private readonly notifications: NotificationPort,
  ) {}

  async execute(propertyId: string): Promise<void> {
    const property = await this.propertyRepo.findById(propertyId);
    if (!property) throw new NotFoundError('Property', propertyId);
    property.activate();
    await this.propertyRepo.save(property);
    await this.notifications.inviteOwners(propertyId);
  }
}
