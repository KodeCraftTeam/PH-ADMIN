import { ConfigService } from '@nestjs/config';
import { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port';
import { User } from '../../../domain/entities/user.entity';
import { TokenPort } from '../../../domain/ports/out/token.port';
import { UserRepository } from '../../../domain/ports/out/user.repository';
import { LoginGoogleUseCase } from './login-google.use-case';

function fakeIdToken(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256' })).toString(
    'base64url',
  );
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${header}.${body}.signature`;
}

describe('LoginGoogleUseCase', () => {
  let userRepo: jest.Mocked<UserRepository>;
  let tokenPort: jest.Mocked<TokenPort>;
  let logger: jest.Mocked<LoggerPort>;
  let useCase: LoginGoogleUseCase;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
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

    fetchMock = jest.fn();
    global.fetch = fetchMock;

    const configService = {
      get: (key: string) =>
        ({
          GOOGLE_CLIENT_ID: 'client-id',
          GOOGLE_CLIENT_SECRET: 'client-secret',
          GOOGLE_REDIRECT_URI: 'http://localhost/callback',
        })[key],
    } as unknown as ConfigService;

    useCase = new LoginGoogleUseCase(
      userRepo,
      tokenPort,
      logger,
      configService,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs in existing user without creating a new one', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id_token: fakeIdToken({
            email: 'existing@test.com',
            name: 'Existing',
          }),
        }),
    });

    userRepo.findByEmail.mockResolvedValue(
      new User('existing-id', 'existing@test.com', 'Existing', 'hash', 'ADMIN'),
    );

    tokenPort.sign.mockResolvedValue('token');

    const result = await useCase.execute('auth-code');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://oauth2.googleapis.com/token',
      expect.objectContaining({ method: 'POST' }),
    );

    expect(userRepo.findByEmail).toHaveBeenCalledWith('existing@test.com');
    expect(userRepo.save).not.toHaveBeenCalled();

    expect(tokenPort.sign).toHaveBeenCalledWith({
      sub: 'existing-id',
      email: 'existing@test.com',
      role: 'ADMIN',
    });

    expect(result).toEqual({
      accessToken: 'token',
      name: 'Existing',
      role: 'ADMIN',
    });
  });

  it('creates a new user when none exists for the google email', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id_token: fakeIdToken({ email: 'new@test.com', name: 'New' }),
        }),
    });

    userRepo.findByEmail.mockResolvedValue(null);
    tokenPort.sign.mockResolvedValue('token');

    const result = await useCase.execute('auth-code');

    expect(userRepo.save).toHaveBeenCalledTimes(1);
    const savedUser = userRepo.save.mock.calls[0][0];
    expect(savedUser.email).toBe('new@test.com');
    expect(savedUser.name).toBe('New');
    expect(savedUser.role).toBe('ADMIN');

    expect(tokenPort.sign).toHaveBeenCalledWith({
      sub: savedUser.id,
      email: 'new@test.com',
      role: 'ADMIN',
    });

    expect(result).toEqual({
      accessToken: 'token',
      name: 'New',
      role: 'ADMIN',
    });
  });
});
