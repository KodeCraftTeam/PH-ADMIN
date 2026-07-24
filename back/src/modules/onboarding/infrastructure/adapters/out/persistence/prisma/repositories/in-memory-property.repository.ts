import { Injectable } from '@nestjs/common';
import { Property } from '../../../../../../domain/entities/property.entity';
import { PropertyRepository } from '../../../../../../domain/ports/out/property.repository';

/**
 * Outbound (driven) adapter: in-memory persistence.
 * Placeholder until Postgres/Prisma is wired in — same port, different adapter.
 */
@Injectable()
export class InMemoryPropertyRepository implements PropertyRepository {
  private readonly data = new Map<string, Property>();

  async save(property: Property): Promise<void> {
    this.data.set(property.id, property);
  }

  async findById(id: string): Promise<Property | null> {
    return this.data.get(id) ?? null;
  }
}
