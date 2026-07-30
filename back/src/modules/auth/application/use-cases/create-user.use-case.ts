import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../../domain/ports/out/user.repository';
import type { UserRepository } from '../../domain/ports/out/user.repository';
import { PASSWORD_HASHER } from '../../domain/ports/out/password-hasher.port';
import type { PasswordHasherPort } from '../../domain/ports/out/password-hasher.port';
import { CreateUserDto } from '../dto/create-user.dto';
import { EmailAlreadyRegisteredError } from '../../domain/errors/email-already-registered.error';
import { LOGGER_PORT } from '../../../../shared/domain/ports/out/logger.port';
import type { LoggerPort } from '../../../../shared/domain/ports/out/logger.port';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  async execute(dto: CreateUserDto): Promise<{ id: string }> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new EmailAlreadyRegisteredError(dto.email);
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);
    const user = new User(
      randomUUID(),
      dto.email,
      passwordHash,
      dto.name,
      dto.role,
    );
    await this.userRepo.save(user);

    this.logger.log(`User ${user.id} created`, 'CreateUserUseCase');
    return { id: user.id };
  }
}
