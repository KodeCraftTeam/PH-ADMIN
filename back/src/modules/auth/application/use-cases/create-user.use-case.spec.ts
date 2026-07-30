import { CreateUserUseCase } from './create-user.use-case';
import { UserRepository } from '../../domain/ports/out/user.repository';
import { PasswordHasherPort } from '../../domain/ports/out/password-hasher.port';
import { EmailAlreadyRegisteredError } from '../../domain/errors/email-already-registered.error';
import { User } from '../../domain/entities/user.entity';
import { LoggerPort } from '../../../../shared/domain/ports/out/logger.port';

describe('CreateUserUseCase', () => {
  let userRepo: jest.Mocked<UserRepository>;
  let passwordHasher: jest.Mocked<PasswordHasherPort>;
  let logger: jest.Mocked<LoggerPort>;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    userRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };
    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };
    logger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
    useCase = new CreateUserUseCase(userRepo, passwordHasher, logger);
  });

  it('hashes the password and saves the new user', async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue('hashed-password');

    const result = await useCase.execute({
      email: 'admin@test.com',
      password: 'secret123',
      name: 'Admin',
      role: 'SUPER_ADMIN',
    });

    expect(passwordHasher.hash).toHaveBeenCalledWith('secret123');
    expect(userRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'admin@test.com',
        passwordHash: 'hashed-password',
      }),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expect(result).toEqual({ id: expect.any(String) });
  });

  it('throws EmailAlreadyRegisteredError when the email is taken', async () => {
    userRepo.findByEmail.mockResolvedValue(
      new User('existing-id', 'admin@test.com', 'hash', 'Admin', 'SUPER_ADMIN'),
    );

    await expect(
      useCase.execute({
        email: 'admin@test.com',
        password: 'secret123',
        name: 'Admin',
        role: 'SUPER_ADMIN',
      }),
    ).rejects.toThrow(EmailAlreadyRegisteredError);

    expect(userRepo.save).not.toHaveBeenCalled();
  });
});
