import { Inject } from '@nestjs/common';
import { ForgotPasswordDto } from '../../dto/forgot-password.dto';
import { USER_REPOSITORY } from '../../../domain/ports/out/user.repository';
import type { UserRepository } from '../../../domain/ports/out/user.repository';
import { EMAIL_SENDER_PORT } from '../../../../../shared/domain/ports/out/email-sender.port';
import type { EmailSenderPort } from '../../../../../shared/domain/ports/out/email-sender.port';
import { GoogleAccountPasswordRecoveryError } from '../../../domain/errors/google-account-password-recovery.error';
import { UserNotFoundError } from '../../../domain/errors/user-not-found.error';
import { PASSWORD_HASHER } from '../../../domain/ports/out/password-hasher.port';
import type { PasswordHasherPort } from '../../../domain/ports/out/password-hasher.port';
import { LOGGER_PORT } from '../../../../../shared/domain/ports/out/logger.port';
import type { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port';
import { randomInt } from 'node:crypto';
import { ConfigService } from '@nestjs/config';

export class ForgotPasswordUseCase {
  private readonly templateId: string;

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: PasswordHasherPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(EMAIL_SENDER_PORT) private readonly emailSender: EmailSenderPort,
    configService: ConfigService,
  ) {
    this.templateId =
      configService.get<string>('SEND_RESET_PASSWORD_TEMPLATE_ID') ?? '';
  }

  async execute(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepo.findByEmail(dto.email);

    if (!user) throw new UserNotFoundError(dto.email);

    const isGoogleUser = !user.passwordHash;

    if (isGoogleUser) {
      throw new GoogleAccountPasswordRecoveryError(dto.email);
    }

    const code = String(randomInt(100000, 1000000));
    const codeHash = await this.hasher.hash(code);

    await this.userRepo.save({ ...user, code: codeHash });

    await this.emailSender.sendTemplate({
      templateId: this.templateId,
      to: dto.email,
      variables: { code },
    });

    this.logger.log(
      `User ${user.id} recovered password`,
      'ForgotPasswordUseCase',
    );
  }
}
