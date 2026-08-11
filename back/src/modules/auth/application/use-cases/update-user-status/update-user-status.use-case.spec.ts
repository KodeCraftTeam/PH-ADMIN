import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/ports/out/user.repository';
import { UpdateUserStatusUseCase } from './update-user-status.use-case';

describe('update status use case', () => {
  let useCase: UpdateUserStatusUseCase;
  let userRepo: jest.Mocked<UserRepository>;
  let logger: jest.Mocked<LoggerPort>;

  beforeEach(() => {
    userRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };
    logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };
    useCase = new UpdateUserStatusUseCase(userRepo, logger);
  });

  it('user does not exist', async () => {
    userRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('user-id', { status: 'ACTIVE' }),
    ).rejects.toThrow(NotFoundError);
  });

  it('update user successfully', async () => {
    userRepo.findById.mockResolvedValue(
      new User(
        'existing-id',
        'admin@test.com',
        'admin name',
        'hash-password',
        'ADMIN',
        'ONBOARDING',
        undefined,
      ),
    );

    await useCase.execute('user-id', { status: 'ACTIVE' });

    expect(userRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'admin@test.com',
        passwordHash: 'hash-password',
        role: 'ADMIN',
        status: 'ACTIVE',
      }),
    );
  });
});
