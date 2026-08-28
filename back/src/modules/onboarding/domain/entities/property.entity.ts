import { TaxId } from '../../../../shared/domain/value-objects/tax-id.vo';
import { InvalidActivationStateError } from '../errors/invalid-activation-state.error';
import { CoefficientsNotCompleteError } from '../errors/coefficients-not-complete.error';
import { CoefficientsNotAssignedError } from '../errors/coefficients-not-assigned.error';
import { Coefficient } from '../value-objects/coefficient.vo';

export type PropertyType = 'RESIDENCIAL' | 'COMERCIAL' | 'MIXTO';
export type PropertyStatus =
  'EN_CONFIGURACION' | 'PENDIENTE_REVISION' | 'ACTIVO';

/**
 * Aggregate root: Property (comunidad). Invariante que cruza entidades:
 * la suma de Coefficient de todas sus Unit debe ser 100%. Cualquier
 * escritura que afecte coeficientes debe pasar por este método; el resto
 * de los campos de Unit (piso, estado, matrícula...) no participan de
 * la invariante y pueden escribirse por fuera del aggregate.
 */
export class Property {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly taxId: TaxId,
    public readonly address: string,
    public readonly cityId: string,
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

  static assertCoefficientsComplete(
    coefficients: Array<Coefficient | null>,
  ): void {
    if (coefficients.length === 0) return;

    const missing = coefficients.filter((c) => c === null).length;
    if (missing > 0) {
      throw new CoefficientsNotAssignedError(missing);
    }

    const assigned = coefficients as Coefficient[];
    if (!Coefficient.sumIsHundred(assigned)) {
      const sum = assigned.reduce((acc, c) => acc + c.percentage, 0);
      throw new CoefficientsNotCompleteError(sum);
    }
  }
}
