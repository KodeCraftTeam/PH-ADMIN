import { Inject } from '@nestjs/common';
import { SendEmailDto } from '../../dto/send-email.dto';
import { USER_REPOSITORY } from '../../../domain/ports/out/user.repository';
import type { UserRepository } from '../../../domain/ports/out/user.repository';
import { EmailAlreadyRegisteredError } from '../../../domain/errors/email-already-registered.error';
import { User } from '../../../domain/entities/user.entity';
import { randomInt, randomUUID } from 'node:crypto';
import { PASSWORD_HASHER } from '../../../domain/ports/out/password-hasher.port';
import type { PasswordHasherPort } from '../../../domain/ports/out/password-hasher.port';
import { LOGGER_PORT } from '../../../../../shared/domain/ports/out/logger.port';
import type { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port';
import { EMAIL_SENDER_PORT } from '../../../../../shared/domain/ports/out/email-sender.port';
import type { EmailSenderPort } from '../../../../../shared/domain/ports/out/email-sender.port';
import { ConfigService } from '@nestjs/config';

export class StartRegistrationUseCase {
  private readonly templateId: string;

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: PasswordHasherPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(EMAIL_SENDER_PORT) private readonly emailSender: EmailSenderPort,
    configService: ConfigService,
  ) {
    this.templateId = configService.get<string>('SEND_CODE_TEMPLATE_ID') ?? '';
  }

  async execute(dto: SendEmailDto) {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new EmailAlreadyRegisteredError(dto.email);
    }

    const code = String(randomInt(100000, 1000000));
    const codeHash = await this.hasher.hash(code);

    const user = new User(
      randomUUID(),
      dto.email,
      '',
      '',
      'ADMIN',
      'PENDING',
      codeHash,
    );

    await this.userRepo.save(user);

    await this.emailSender.sendTemplate({
      templateId: this.templateId,
      to: dto.email,
      variables: { code },
    });

    this.logger.log(`User ${user.id} registered`, 'StartRegistrationUseCase');
  }
}
