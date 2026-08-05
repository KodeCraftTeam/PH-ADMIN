/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { UserModel as UserRecord } from '@prisma/client';
import {
  User,
  UserRole,
  UserStatus,
} from '../../../../domain/entities/user.entity';

export function toDomainUser(record: UserRecord): User {
  return new User(
    record.id,
    record.email,
    record.password ?? '',
    record.name,
    record.role as UserRole,
    record.status as UserStatus,
    record.code || undefined,
  );
}
