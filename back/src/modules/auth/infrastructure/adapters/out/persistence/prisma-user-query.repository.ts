import { Injectable } from '@nestjs/common';
import { UserQueryPort } from '../../../../application/ports/out/user-query.port';
import { UserListItemReadModel } from '../../../../application/read-models/user-list-item.read-model';
import { UserRole } from '../../../../domain/entities/user.entity';
import { PrismaService } from '../../../../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaUserQueryRepository implements UserQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<UserListItemReadModel[]> {
    const records = await this.prisma.userModel.findMany({
      select: { id: true, email: true, name: true, role: true },
    });
    return records.map((record) => ({
      id: record.id,
      email: record.email,
      name: record.name,
      role: record.role as UserRole,
    }));
  }
}
