import { ConfigService } from '@nestjs/config';
import { EmailSenderPort } from '../../../../../shared/domain/ports/out/email-sender.port';
import { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port';
import { PasswordHasherPort } from '../../../domain/ports/out/password-hasher.port';
import { UserRepository } from '../../../domain/ports/out/user.repository';
import { ForgotPasswordUseCase } from './forgot-password.use-case';
import { User } from '../../../domain/entities/user.entity';
import { UserNotFoundError } from '../../../domain/errors/user-not-found.error';
import { GoogleAccountPasswordRecoveryError } from '../../../domain/errors/google-account-password-recovery.error';
import { randomInt } from 'node:crypto';

jest.mock('node:crypto', () => ({
  ...jest.requireActual<typeof import('node:crypto')>('node:crypto'),
  randomInt: jest.fn(),
}));

describe('ForgotPasswordUseCase', () => {
  let userRepo: jest.Mocked<UserRepository>;
  let hashCode: jest.Mocked<PasswordHasherPort>;
  let logger: jest.Mocked<LoggerPort>;
  let emailSender: jest.Mocked<EmailSenderPort>;
  let configService: jest.Mocked<ConfigService>;
  let useCase: ForgotPasswordUseCase;

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
      get: jest.fn().mockReturnValue('SEND_RESET_PASSWORD_TEMPLATE_ID'),
    } as unknown as jest.Mocked<ConfigService>;

    useCase = new ForgotPasswordUseCase(
      userRepo,
      hashCode,
      logger,
      emailSender,
      configService,
    );
  });

  it('should throw error if user not found', async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute({ email: 'admin@test.com' })).rejects.toThrow(
      UserNotFoundError,
    );
  });

  it('should throw error if user has no password (Google account)', async () => {
    userRepo.findByEmail.mockResolvedValue(
      new User('existing-id', 'admin@test.com', '', null, 'ADMIN', 'ACTIVE'),
    );

    await expect(useCase.execute({ email: 'admin@test.com' })).rejects.toThrow(
      GoogleAccountPasswordRecoveryError,
    );
  });

  it('should send email with code for a regular user', async () => {
    (randomInt as jest.Mock).mockReturnValue(123456);

    userRepo.findByEmail.mockResolvedValue(
      new User(
        'existing-id',
        'admin@test.com',
        '',
        'password-hash',
        'ADMIN',
        'ACTIVE',
      ),
    );
    hashCode.hash.mockResolvedValue('hashed-code');

    await useCase.execute({ email: 'admin@test.com' });

    expect(userRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'admin@test.com',
        code: 'hashed-code',
      }),
    );

    expect(emailSender.sendTemplate).toHaveBeenCalledWith({
      templateId: 'SEND_RESET_PASSWORD_TEMPLATE_ID',
      to: 'admin@test.com',
      variables: { code: '123456' },
    });
  });
});
