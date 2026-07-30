import { UserListItemReadModel } from '../../read-models/user-list-item.read-model';

export interface UserQueryPort {
  list(): Promise<UserListItemReadModel[]>;
}

export const USER_QUERY_PORT = Symbol('UserQueryPort');
