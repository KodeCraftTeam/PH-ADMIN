import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import type { PersonType } from '../../domain/entities/administrator-profile.entity';

export class RegisterAdministratorDto {
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
