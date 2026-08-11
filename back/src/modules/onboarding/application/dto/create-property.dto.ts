import { IsIn, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import type { PropertyType } from '../../domain/entities/property.entity';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  taxId!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsUUID()
  cityId!: string;

  @IsIn(['RESIDENCIAL', 'COMERCIAL', 'MIXTO'])
  type!: PropertyType;

  @IsNumber()
  totalUnits!: number;

  @IsNumber()
  totalTowers!: number;

  @IsString()
  @IsNotEmpty()
  adminName!: string;

  @IsString()
  @IsNotEmpty()
  adminEmail!: string;
}
