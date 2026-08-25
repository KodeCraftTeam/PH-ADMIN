export type UnitGroupType = 'TORRE' | 'MANZANA' | 'ETAPA' | 'SECTOR';

export class UnitGroup {
  constructor(
    public readonly id: string,
    public readonly communityId: string,
    public readonly name: string,
    public readonly type: UnitGroupType,
    public readonly sortOrder: number | null = null,
  ) {}
}
