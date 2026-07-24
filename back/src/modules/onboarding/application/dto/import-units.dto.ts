export class ImportedUnitDto {
  code!: string;
  tower!: string;
  type!: string;
  areaM2!: number;
  coefficient!: number;
  ownerName!: string;
  ownerIdNumber!: string;
  ownerEmail!: string;
  ownerPhone!: string;
}

export class ImportUnitsDto {
  propertyId!: string;
  units!: ImportedUnitDto[];
}

export class ValidationResultDto {
  totalRows!: number;
  validRows!: number;
  coefficientSum!: number;
  errors!: Array<{ code: string; detail: string }>;
}
