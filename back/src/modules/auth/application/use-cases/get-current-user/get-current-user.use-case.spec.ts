import { GetCurrentUserUseCase } from './get-current-user.use-case';
import { UserRepository } from '../../../domain/ports/out/user.repository';
import { InvalidCredentialsError } from '../../../domain/errors/invalid-credentials.error';
import { User } from '../../../domain/entities/user.entity';

describe('GetCurrentUserUseCase', () => {
  let userRepo: jest.Mocked<UserRepository>;
  let useCase: GetCurrentUserUseCase;

  beforeEach(() => {
    userRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };
    useCase = new GetCurrentUserUseCase(userRepo);
  });

  it('returns name and role for an existing user', async () => {
    userRepo.findById.mockResolvedValue(
      new User('user-id', 'admin@test.com', 'Admin', 'hash', 'ADMIN'),
    );

    const result = await useCase.execute('user-id');

    expect(userRepo.findById).toHaveBeenCalledWith('user-id');
    expect(result).toEqual({ name: 'Admin', role: 'ADMIN' });
  });

  it('throws InvalidCredentialsError when the user no longer exists', async () => {
    userRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toThrow(
      InvalidCredentialsError,
    );
  });
});
