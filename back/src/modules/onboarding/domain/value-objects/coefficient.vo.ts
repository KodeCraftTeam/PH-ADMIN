import { CoefficientOutOfRangeError } from '../errors/coefficient-out-of-range.error';

export type CoefficientOrigin = 'CALCULADO' | 'REGLAMENTO';

/**
 * Value Object: coeficiente de copropiedad (porcentaje).
 * Regla de negocio central: la suma de todos los coeficientes de una
 * copropiedad debe dar exactamente 100%. `origin` es solo auditoría
 * (calculado por área vs. tomado del reglamento notarial) y nunca afecta esa regla.
 */
export class Coefficient {
  private constructor(
    public readonly percentage: number,
    public readonly origin: CoefficientOrigin,
  ) {}

  static create(
    percentage: number,
    origin: CoefficientOrigin = 'CALCULADO',
  ): Coefficient {
    if (percentage <= 0 || percentage > 100) {
      throw new CoefficientOutOfRangeError(percentage);
    }
    return new Coefficient(Number(percentage.toFixed(4)), origin);
  }

  static sumIsHundred(coefficients: Coefficient[]): boolean {
    const sum = coefficients.reduce((acc, c) => acc + c.percentage, 0);
    return Math.abs(sum - 100) < 0.001;
  }
}
