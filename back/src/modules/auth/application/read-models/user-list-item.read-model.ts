import { UserRole } from '../../domain/entities/user.entity';

export interface UserListItemReadModel {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
