import { TaxId } from '../../../../shared/domain/value-objects/tax-id.vo';

export type PersonType = 'NATURAL' | 'JURIDICA';

export class AdministratorProfile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly personType: PersonType,
    public readonly nameOrBusinessName: string,
    public readonly taxId: TaxId,
    public readonly cityId: string,
    public readonly phoneNumber?: string,
    public readonly address?: string,
    public readonly legalRepresentative?: string,
  ) {}
}
