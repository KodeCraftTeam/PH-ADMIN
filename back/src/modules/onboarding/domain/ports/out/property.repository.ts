import { Property } from '../../entities/property.entity';

/**
 * Port de salida (driven): persistencia del aggregate Property.
 * Implementado por infraestructura (Postgres, en memoria…).
 */
export interface PropertyRepository {
  save(property: Property, userId?: string): Promise<void>;
  findById(id: string): Promise<Property | null>;
}

export const PROPERTY_REPOSITORY = Symbol('PropertyRepository');
