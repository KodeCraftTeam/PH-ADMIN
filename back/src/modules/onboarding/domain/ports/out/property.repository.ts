import { Property } from '../../entities/property.entity';

/**
 * Outbound (driven) port: persistence for the Property aggregate.
 * Implemented by infrastructure (Postgres, in-memory…).
 */
export interface PropertyRepository {
  save(property: Property, userId?: string): Promise<void>;
  findById(id: string): Promise<Property | null>;
  findByUserId(userId: string): Promise<Property[]>;
}

export const PROPERTY_REPOSITORY = Symbol('PropertyRepository');
