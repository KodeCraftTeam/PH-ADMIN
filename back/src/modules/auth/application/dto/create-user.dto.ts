import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import type { UserRole } from '../../domain/entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn(['SUPER_ADMIN', 'ADMIN'])
  role!: UserRole;
}
