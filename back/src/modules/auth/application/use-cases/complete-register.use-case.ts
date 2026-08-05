import { Inject } from '@nestjs/common';
import { CompleteRegisterDto } from '../dto/complete-register';
import { USER_REPOSITORY } from '../../domain/ports/out/user.repository';
import type { UserRepository } from '../../domain/ports/out/user.repository';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { PASSWORD_HASHER } from '../../domain/ports/out/password-hasher.port';
import type { PasswordHasherPort } from '../../domain/ports/out/password-hasher.port';
import { LOGGER_PORT } from '../../../../shared/domain/ports/out/logger.port';
import type { LoggerPort } from '../../../../shared/domain/ports/out/logger.port';

export class CompleteRegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly PasswordHasher: PasswordHasherPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  async execute(dto: CompleteRegisterDto) {
    const existing = await this.userRepo.findByEmail(dto.email);

    if (!existing) {
      throw new UserNotFoundError(dto.email);
    }

    const passwordHash = await this.PasswordHasher.hash(dto.password);

    await this.userRepo.save({
      ...existing,
      name: dto.name,
      passwordHash: passwordHash,
      status: 'ONBOARDING',
    });

    this.logger.log(
      `User ${existing.id} completed registration`,
      'CompleteRegisterUseCase',
    );
  }
}
