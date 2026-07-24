/**
 * Outbound port: notifications (email to owners on activation,
 * alert to support when validation keeps failing).
 */
export interface NotificationPort {
  inviteOwners(propertyId: string): Promise<void>;
  alertSupport(propertyId: string, reason: string): Promise<void>;
}

export const NOTIFICATION_PORT = Symbol('NotificationPort');
