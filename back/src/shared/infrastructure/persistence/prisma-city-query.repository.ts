import { Injectable } from '@nestjs/common';
import { CityQueryPort } from '../../application/ports/out/city-query.port';
import { CityListItemReadModel } from '../../application/read-models/city-list-item.read-model';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaCityQueryRepository implements CityQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<CityListItemReadModel[]> {
    const records = await this.prisma.cityModel.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
    return records;
  }
}
