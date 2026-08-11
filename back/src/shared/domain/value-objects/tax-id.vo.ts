import { InvalidTaxIdError } from '../errors/invalid-tax-id.error';

export class TaxId {
  private constructor(public readonly value: string) {}

  static create(value: string): TaxId {
    const clean = value.replace(/[.\s]/g, '');
    if (!/^\d{6,10}-?\d$/.test(clean)) {
      throw new InvalidTaxIdError(value);
    }
    return new TaxId(clean);
  }
}
