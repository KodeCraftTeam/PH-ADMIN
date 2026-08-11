import { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port';
import { User } from '../../../domain/entities/user.entity';
import { InvalidVerificationCodeError } from '../../../domain/errors/invalid-verification-code.error';
import { PasswordHasherPort } from '../../../domain/ports/out/password-hasher.port';
import { UserRepository } from '../../../domain/ports/out/user.repository';
import { VerifyResetCodeUseCase } from './verify-reset-code.use-case';

describe('VerifyResetCodeUseCase', () => {
  let userRepo: jest.Mocked<UserRepository>;
  let hashCode: jest.Mocked<PasswordHasherPort>;
  let logger: jest.Mocked<LoggerPort>;
  let useCase: VerifyResetCodeUseCase;

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
    useCase = new VerifyResetCodeUseCase(userRepo, hashCode, logger);
  });

  it('should throw error if user not found', async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'admin@test.com', code: '123456' }),
    ).rejects.toThrow(InvalidVerificationCodeError);
  });

  it('should throw error if user has no pending code', async () => {
    userRepo.findByEmail.mockResolvedValue(
      new User('existing-id', 'admin@test.com', '', 'hash', 'ADMIN', 'ACTIVE'),
    );

    await expect(
      useCase.execute({ email: 'admin@test.com', code: '123456' }),
    ).rejects.toThrow(InvalidVerificationCodeError);
  });

  it('should throw error if code is invalid', async () => {
    userRepo.findByEmail.mockResolvedValue(
      new User(
        'existing-id',
        'admin@test.com',
        '',
        'hash',
        'ADMIN',
        'ACTIVE',
        'hashed-code',
      ),
    );
    hashCode.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'admin@test.com', code: '123456' }),
    ).rejects.toThrow(InvalidVerificationCodeError);
  });

  it('should resolve without mutating the user when code is valid', async () => {
    userRepo.findByEmail.mockResolvedValue(
      new User(
        'existing-id',
        'admin@test.com',
        '',
        'hash',
        'ADMIN',
        'ACTIVE',
        'hashed-code',
      ),
    );
    hashCode.compare.mockResolvedValue(true);

    await useCase.execute({ email: 'admin@test.com', code: '123456' });

    expect(userRepo.save).not.toHaveBeenCalled();
  });
});
