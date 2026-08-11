import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}
