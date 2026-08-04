import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import type { PersonType } from '../../domain/entities/administrator-profile.entity';

export class RegisterAdministratorDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsIn(['NATURAL', 'JURIDICA'])
  personType!: PersonType;

  @IsString()
  @IsNotEmpty()
  nameOrBusinessName!: string;

  @IsString()
  @IsNotEmpty()
  taxId!: string;

  @IsUUID()
  cityId!: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  legalRepresentative?: string;
}
