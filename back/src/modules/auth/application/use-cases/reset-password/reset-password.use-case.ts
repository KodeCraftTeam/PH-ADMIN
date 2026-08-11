import { ResetPasswordDto } from '../../dto/reset-password.dto';
import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../domain/ports/out/user.repository';
import type { UserRepository } from '../../../domain/ports/out/user.repository';
import { PASSWORD_HASHER } from '../../../domain/ports/out/password-hasher.port';
import type { PasswordHasherPort } from '../../../domain/ports/out/password-hasher.port';
import { LOGGER_PORT } from '../../../../../shared/domain/ports/out/logger.port';
import type { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port';
import { InvalidVerificationCodeError } from '../../../domain/errors/invalid-verification-code.error';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: PasswordHasherPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  async execute(dto: ResetPasswordDto) {
    const existing = await this.userRepo.findByEmail(dto.email);

    if (!existing) {
      throw new InvalidVerificationCodeError();
    }

    if (existing.code === undefined) {
      throw new InvalidVerificationCodeError();
    }

    const isValid = await this.hasher.compare(dto.code, existing.code);

    if (!isValid) {
      throw new InvalidVerificationCodeError();
    }

    const passwordHash = await this.hasher.hash(dto.newPassword);

    await this.userRepo.save({
      ...existing,
      passwordHash,
      code: undefined,
    });

    this.logger.log(
      `User ${existing.id} reset password`,
      'ResetPasswordUseCase',
    );
  }
}
