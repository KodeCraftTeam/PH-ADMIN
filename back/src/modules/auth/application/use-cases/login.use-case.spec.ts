import { LoggerPort } from '../../../../shared/domain/ports/out/logger.port';
import { User } from '../../domain/entities/user.entity';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { PasswordHasherPort } from '../../domain/ports/out/password-hasher.port';
import { TokenPort } from '../../domain/ports/out/token.port';
import { UserRepository } from '../../domain/ports/out/user.repository';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  let userRepo: jest.Mocked<UserRepository>;
  let passwordHasher: jest.Mocked<PasswordHasherPort>;
  let tokenPort: jest.Mocked<TokenPort>;
  let logger: jest.Mocked<LoggerPort>;
  let useCase: LoginUseCase;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };
    tokenPort = {
      sign: jest.fn(),
      verify: jest.fn(),
    };
    logger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
    useCase = new LoginUseCase(userRepo, passwordHasher, tokenPort, logger);
  });

  it('login with email not found', async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'admin@test.com', password: 'secret' }),
    ).rejects.toThrow(InvalidCredentialsError);

    expect(userRepo.findByEmail).toHaveBeenCalledWith('admin@test.com');
    expect(passwordHasher.compare).not.toHaveBeenCalled();
    expect(tokenPort.sign).not.toHaveBeenCalled();
  });

  it('login with invalid password', async () => {
    userRepo.findByEmail.mockResolvedValue(
      new User('existing-id', 'admin@test.com', 'hash', 'Admin', 'SUPER_ADMIN'),
    );

    passwordHasher.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'admin@test.com', password: 'secret' }),
    ).rejects.toThrow(InvalidCredentialsError);

    expect(userRepo.findByEmail).toHaveBeenCalledWith('admin@test.com');

    expect(passwordHasher.compare).toHaveBeenCalledWith('secret', 'hash');

    expect(tokenPort.sign).not.toHaveBeenCalled();
  });

  it('login with valid credentials', async () => {
    userRepo.findByEmail.mockResolvedValue(
      new User('existing-id', 'admin@test.com', 'hash', 'Admin', 'SUPER_ADMIN'),
    );

    passwordHasher.compare.mockResolvedValue(true);

    tokenPort.sign.mockResolvedValue('token');

    const result = await useCase.execute({
      email: 'admin@test.com',
      password: 'secret',
    });

    expect(userRepo.findByEmail).toHaveBeenCalledWith('admin@test.com');

    expect(passwordHasher.compare).toHaveBeenCalledWith('secret', 'hash');

    expect(tokenPort.sign).toHaveBeenCalledWith({
      sub: 'existing-id',
      email: 'admin@test.com',
      role: 'SUPER_ADMIN',
    });

    expect(result).toEqual({
      accessToken: 'token',
      name: 'Admin',
      role: 'SUPER_ADMIN',
    });
  });
});
