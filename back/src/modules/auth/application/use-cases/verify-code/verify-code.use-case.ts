import { SendCodeDto } from '../../dto/send-code.dto';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../domain/ports/out/user.repository';
import type { UserRepository } from '../../../domain/ports/out/user.repository';
import { PASSWORD_HASHER } from '../../../domain/ports/out/password-hasher.port';
import type { PasswordHasherPort } from '../../../domain/ports/out/password-hasher.port';
import { LOGGER_PORT } from '../../../../../shared/domain/ports/out/logger.port';
import type { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port';
import { InvalidVerificationCodeError } from '../../../domain/errors/invalid-verification-code.error';

export class VerifyCodeUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: PasswordHasherPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  async execute(dto: SendCodeDto) {
    const existing = await this.userRepo.findByEmail(dto.email);

    if (!existing) {
      throw new InvalidVerificationCodeError();
    }

    if (existing.status !== 'PENDING' || existing.code === undefined) {
      throw new InvalidVerificationCodeError();
    }

    const isValid = await this.hasher.compare(dto.code, existing.code);

    if (!isValid) {
      throw new InvalidVerificationCodeError();
    }

    await this.userRepo.save({
      ...existing,
      code: undefined,
    });

    this.logger.log(`Code verificado: ${dto.email}`, 'VerifyCodeUseCase');
  }
}
