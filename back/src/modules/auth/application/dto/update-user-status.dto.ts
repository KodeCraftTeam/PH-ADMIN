import { IsIn } from 'class-validator';
import type { UserStatus } from '../../domain/entities/user.entity';

export class UpdateUserStatusDto {
  @IsIn(['ACTIVE', 'INACTIVE', 'PENDING', 'ONBOARDING'])
  status!: UserStatus;
}
