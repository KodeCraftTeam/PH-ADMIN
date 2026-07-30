import { TaxId } from '../value-objects/tax-id.vo';
import { InvalidActivationStateError } from '../errors/invalid-activation-state.error';

export type PropertyType = 'RESIDENCIAL' | 'COMERCIAL' | 'MIXTO';
export type PropertyStatus =
  'EN_CONFIGURACION' | 'PENDIENTE_REVISION' | 'ACTIVO';

/**
 * Aggregate root for onboarding: a horizontal property (PH complex)
 * going through initial setup.
 */
export class Property {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly taxId: TaxId,
    public readonly address: string,
    public readonly city: string,
    public readonly type: PropertyType,
    public readonly declaredTotalUnits: number,
    private status: PropertyStatus = 'EN_CONFIGURACION',
  ) {}

  activate(): void {
    if (this.status !== 'EN_CONFIGURACION') {
      throw new InvalidActivationStateError(this.status);
    }
    this.status = 'ACTIVO';
  }

  get currentStatus(): PropertyStatus {
    return this.status;
  }
}
