import { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port';
import { User } from '../../../domain/entities/user.entity';
import { InvalidVerificationCodeError } from '../../../domain/errors/invalid-verification-code.error';
import { PasswordHasherPort } from '../../../domain/ports/out/password-hasher.port';
import { UserRepository } from '../../../domain/ports/out/user.repository';
import { ResetPasswordUseCase } from './reset-password.use-case';

describe('ResetPasswordUseCase', () => {
  let userRepo: jest.Mocked<UserRepository>;
  let hashCode: jest.Mocked<PasswordHasherPort>;
  let logger: jest.Mocked<LoggerPort>;
  let useCase: ResetPasswordUseCase;

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
    useCase = new ResetPasswordUseCase(userRepo, hashCode, logger);
  });

  const dto = {
    email: 'admin@test.com',
    code: '123456',
    newPassword: 'new-secret',
  };

  it('should throw error if user not found', async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(
      InvalidVerificationCodeError,
    );
  });

  it('should throw error if user has no pending code', async () => {
    userRepo.findByEmail.mockResolvedValue(
      new User('existing-id', 'admin@test.com', '', 'hash', 'ADMIN', 'ACTIVE'),
    );

    await expect(useCase.execute(dto)).rejects.toThrow(
      InvalidVerificationCodeError,
    );
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

    await expect(useCase.execute(dto)).rejects.toThrow(
      InvalidVerificationCodeError,
    );
  });

  it('should hash and save the new password, clearing the code', async () => {
    userRepo.findByEmail.mockResolvedValue(
      new User(
        'existing-id',
        'admin@test.com',
        '',
        'old-hash',
        'ADMIN',
        'ACTIVE',
        'hashed-code',
      ),
    );
    hashCode.compare.mockResolvedValue(true);
    hashCode.hash.mockResolvedValue('new-password-hash');

    await useCase.execute(dto);

    expect(hashCode.hash).toHaveBeenCalledWith('new-secret');
    expect(userRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'admin@test.com',
        passwordHash: 'new-password-hash',
        code: undefined,
      }),
    );
  });
});
