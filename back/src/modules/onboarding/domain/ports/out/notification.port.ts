/**
 * Port de salida: notificaciones (correo a propietarios al activar,
 * alerta a soporte cuando la validación sigue fallando).
 */
export interface NotificationPort {
  inviteOwners(propertyId: string): Promise<void>;
  alertSupport(propertyId: string, reason: string): Promise<void>;
}

export const NOTIFICATION_PORT = Symbol('NotificationPort');
