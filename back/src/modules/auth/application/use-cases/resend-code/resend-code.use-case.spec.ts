import { ConfigService } from '@nestjs/config';
import { EmailSenderPort } from '../../../../../shared/domain/ports/out/email-sender.port';
import { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port';
import { PasswordHasherPort } from '../../../domain/ports/out/password-hasher.port';
import { UserRepository } from '../../../domain/ports/out/user.repository';
import { ResendCodeUseCase } from './resend-code.use-case';
import { User } from '../../../domain/entities/user.entity';
import { UserNotFoundError } from '../../../domain/errors/user-not-found.error';
import { randomInt } from 'node:crypto';

jest.mock('node:crypto', () => ({
  ...jest.requireActual<typeof import('node:crypto')>('node:crypto'),
  randomInt: jest.fn(),
}));

describe('ResendCodeUseCase', () => {
  let userRepo: jest.Mocked<UserRepository>;
  let hashCode: jest.Mocked<PasswordHasherPort>;
  let logger: jest.Mocked<LoggerPort>;
  let emailSender: jest.Mocked<EmailSenderPort>;
  let configService: jest.Mocked<ConfigService>;
  let useCase: ResendCodeUseCase;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    hashCode = {
      hash: jest.fn(),
      compare: jest.fn(),
    };
    logger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
    emailSender = {
      sendTemplate: jest.fn(),
    };
    configService = {
      get: jest.fn().mockReturnValue('SEND_CODE_TEMPLATE_ID'),
    } as unknown as jest.Mocked<ConfigService>;

    useCase = new ResendCodeUseCase(
      userRepo,
      hashCode,
      logger,
      emailSender,
      configService,
    );
  });

  it('should send error if user not found', async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute({ email: 'admin@test.com' })).rejects.toThrow(
      UserNotFoundError,
    );
  });

  it('should send email with code', async () => {
    (randomInt as jest.Mock).mockReturnValue(123456);

    userRepo.findByEmail.mockResolvedValue(
      new User('existing-id', 'admin@test.com', '', '', 'ADMIN', 'PENDING'),
    );
    hashCode.hash.mockResolvedValue('hashed-code');

    await useCase.execute({ email: 'admin@test.com' });

    expect(userRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'admin@test.com',
        passwordHash: '',
        role: 'ADMIN',
        status: 'PENDING',
        code: 'hashed-code',
      }),
    );

    expect(emailSender.sendTemplate).toHaveBeenCalledWith({
      templateId: 'SEND_CODE_TEMPLATE_ID',
      to: 'admin@test.com',
      variables: { code: '123456' },
    });
  });
});
