import { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port';
import { User } from '../../../domain/entities/user.entity';
import { UserNotFoundError } from '../../../domain/errors/user-not-found.error';
import { PasswordHasherPort } from '../../../domain/ports/out/password-hasher.port';
import { UserRepository } from '../../../domain/ports/out/user.repository';
import { CompleteRegisterUseCase } from './complete-register.use-case';

describe('CompleteRegisterUseCase', () => {
  let userRepo: jest.Mocked<UserRepository>;
  let hashCode: jest.Mocked<PasswordHasherPort>;
  let logger: jest.Mocked<LoggerPort>;
  let useCase: CompleteRegisterUseCase;

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
    useCase = new CompleteRegisterUseCase(userRepo, hashCode, logger);
  });

  it('should be throw error if user not found', async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: 'admin@test.com',
        name: '',
        password: '',
      }),
    ).rejects.toThrow(UserNotFoundError);
  });

  it('should be change status to onboarding', async () => {
    userRepo.findByEmail.mockResolvedValue(
      new User(
        'existing-id',
        'admin@test.com',
        '',
        '',
        'ADMIN',
        'PENDING',
        undefined,
      ),
    );

    hashCode.hash.mockResolvedValue('hashed-code');

    await useCase.execute({
      email: 'admin@test.com',
      name: 'admin prueba',
      password: 'Password123',
    });

    expect(userRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'admin@test.com',
        passwordHash: 'hashed-code',
        role: 'ADMIN',
        status: 'ONBOARDING',
      }),
    );
  });
});
