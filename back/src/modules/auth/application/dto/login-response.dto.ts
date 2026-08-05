import { UserRole } from '../../domain/entities/user.entity';

export class LoginResponse {
  accessToken!: string;
  name!: string;
  role!: UserRole;
}
