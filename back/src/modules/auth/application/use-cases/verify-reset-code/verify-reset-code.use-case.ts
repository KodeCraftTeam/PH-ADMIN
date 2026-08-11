import { Inject, Injectable } from '@nestjs/common';
import { SendCodeDto } from '../../dto/send-code.dto';
import { USER_REPOSITORY } from '../../../domain/ports/out/user.repository';
import type { UserRepository } from '../../../domain/ports/out/user.repository';
import { PASSWORD_HASHER } from '../../../domain/ports/out/password-hasher.port';
import type { PasswordHasherPort } from '../../../domain/ports/out/password-hasher.port';
import { InvalidVerificationCodeError } from '../../../domain/errors/invalid-verification-code.error';
import { LOGGER_PORT } from '../../../../../shared/domain/ports/out/logger.port';
import type { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port';

@Injectable()
export class VerifyResetCodeUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: PasswordHasherPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  async execute(dto: SendCodeDto): Promise<void> {
    const existing = await this.userRepo.findByEmail(dto.email);

    if (!existing?.code) {
      throw new InvalidVerificationCodeError();
    }

    const isValid = await this.hasher.compare(dto.code, existing.code);

    if (!isValid) {
      throw new InvalidVerificationCodeError();
    }

    this.logger.log(
      `User ${existing.id} verified code`,
      'VerifyResetCodeUseCase',
    );
  }
}
