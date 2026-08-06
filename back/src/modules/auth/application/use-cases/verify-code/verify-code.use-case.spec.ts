import { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port';
import { User } from '../../../domain/entities/user.entity';
import { InvalidVerificationCodeError } from '../../../domain/errors/invalid-verification-code.error';
import { PasswordHasherPort } from '../../../domain/ports/out/password-hasher.port';
import { UserRepository } from '../../../domain/ports/out/user.repository';
import { VerifyCodeUseCase } from './verify-code.use-case';

describe('VerifyCodeUseCase', () => {
  let userRepo: jest.Mocked<UserRepository>;
  let hashCode: jest.Mocked<PasswordHasherPort>;
  let logger: jest.Mocked<LoggerPort>;
  let useCase: VerifyCodeUseCase;

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
    useCase = new VerifyCodeUseCase(userRepo, hashCode, logger);
  });

  it('should be throw error if user not found', async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: 'admin@test.com',
        code: '',
      }),
    ).rejects.toThrow(InvalidVerificationCodeError);
  });

  it('should be throw error if status is not pending or code is missing', async () => {
    userRepo.findByEmail.mockResolvedValue(
      new User('existing-id', 'admin@test.com', '', '', 'ADMIN', 'PENDING'),
    );

    await expect(
      useCase.execute({ email: 'admin@test.com', code: '123456' }),
    ).rejects.toThrow(InvalidVerificationCodeError);
  });

  it('should be throw error if code is invalid', async () => {
    userRepo.findByEmail.mockResolvedValue(
      new User(
        'existing-id',
        'admin@test.com',
        '',
        '',
        'ADMIN',
        'PENDING',
        'hashed-code',
      ),
    );

    hashCode.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'admin@test.com', code: '123456' }),
    ).rejects.toThrow(InvalidVerificationCodeError);
  });

  // it('should be change status to onboarding', async () => {
  //   userRepo.findByEmail.mockResolvedValue(
  //     new User(
  //       'existing-id',
  //       'admin@test.com',
  //       '',
  //       '',
  //       'ADMIN',
  //       'PENDING',
  //       '123456',
  //     ),
  //   );

  //   hashCode.compare.mockResolvedValue(true);

  //   await useCase.execute({ email: 'admin@test.com', code: '123456' });

  //   expect(userRepo.save).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       email: 'admin@test.com',
  //       passwordHash: '',
  //       role: 'ADMIN',
  //       status: 'ONBOARDING',
  //       code: undefined,
  //     }),
  //   );
  // });
});
