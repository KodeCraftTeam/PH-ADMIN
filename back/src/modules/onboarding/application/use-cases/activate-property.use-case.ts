import { Inject, Injectable } from '@nestjs/common';
import { PROPERTY_REPOSITORY } from '../../domain/ports/out/property.repository';
import type { PropertyRepository } from '../../domain/ports/out/property.repository';
import { NOTIFICATION_PORT } from '../../domain/ports/out/notification.port';
import type { NotificationPort } from '../../domain/ports/out/notification.port';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';

/**
 * Use case: activación final de la copropiedad.
 * TODO: validar el checklist completo (unidades cargadas, coeficientes al
 * 100%, sin propietarios faltantes) antes de activar e invitar propietarios.
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
