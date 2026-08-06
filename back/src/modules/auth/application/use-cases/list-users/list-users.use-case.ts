import { Inject, Injectable } from '@nestjs/common';
import { USER_QUERY_PORT } from '../../ports/out/user-query.port';
import type { UserQueryPort } from '../../ports/out/user-query.port';
import { UserListItemReadModel } from '../../read-models/user-list-item.read-model';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_QUERY_PORT) private readonly userQuery: UserQueryPort,
  ) {}

  execute(): Promise<UserListItemReadModel[]> {
    return this.userQuery.list();
  }
}
