import { UserRole } from '../../domain/entities/user.entity';

export class CurrentUserResponse {
  name!: string;
  role!: UserRole;
  needsOnBoarding!: boolean;
}
