import { OwnershipPercentage } from '../value-objects/ownership-percentage.vo';

export class PropertyOwnership {
  constructor(
    public readonly id: string,
    public readonly unitId: string,
    public readonly personId: string,
    public readonly ownershipPercentage: OwnershipPercentage,
    public readonly startDate: Date,
    public readonly isPrimary: boolean,
    public readonly endDate: Date | null = null,
  ) {}
}
