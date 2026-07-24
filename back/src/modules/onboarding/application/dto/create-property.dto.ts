export class CreatePropertyDto {
  name!: string;
  taxId!: string;
  address!: string;
  city!: string;
  type!: 'RESIDENCIAL' | 'COMERCIAL' | 'MIXTO';
  totalUnits!: number;
  totalTowers!: number;
  adminName!: string;
  adminEmail!: string;
}
