import { IsEmail, IsNotEmpty } from 'class-validator';

export class CompleteRegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  password!: string;
}
