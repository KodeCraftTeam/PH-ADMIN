import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../domain/ports/out/user.repository';
import { User } from '../../../../domain/entities/user.entity';
import { PrismaService } from '../../../../../../shared/infrastructure/prisma/prisma.service';
import { toDomainUser } from './prisma-user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    await this.prisma.userModel.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email,
        password: user.passwordHash,
        name: user.name,
        role: user.role,
        status: user.status,
        code: user.code ?? null,
      },
      update: {
        email: user.email,
        password: user.passwordHash,
        name: user.name,
        role: user.role,
        status: user.status,
        code: user.code ?? null,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.userModel.findUnique({ where: { id } });
    return record ? toDomainUser(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.userModel.findUnique({ where: { email } });
    return record ? toDomainUser(record) : null;
  }
}
