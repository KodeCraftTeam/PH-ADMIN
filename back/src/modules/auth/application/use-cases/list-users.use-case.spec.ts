import { UserQueryPort } from '../ports/out/user-query.port';
import { ListUsersUseCase } from './list-users.use-case';

describe('ListUsersUseCase', () => {
  let useCase: ListUsersUseCase;
  let userQuery: jest.Mocked<UserQueryPort>;

  beforeEach(() => {
    userQuery = {
      list: jest.fn(),
    };
    useCase = new ListUsersUseCase(userQuery);
  });

  it('should return an empty list if no users', async () => {
    userQuery.list.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it('should return a list of users', async () => {
    userQuery.list.mockResolvedValue([
      { id: '1', email: 'admin@test.com', name: 'Admin', role: 'SUPER_ADMIN' },
      { id: '2', email: 'user@test.com', name: 'User', role: 'ADMIN' },
    ]);

    const result = await useCase.execute();

    expect(result).toEqual([
      { id: '1', email: 'admin@test.com', name: 'Admin', role: 'SUPER_ADMIN' },
      { id: '2', email: 'user@test.com', name: 'User', role: 'ADMIN' },
    ]);
  });
});
