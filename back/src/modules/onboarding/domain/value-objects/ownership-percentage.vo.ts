import { OwnershipPercentageOutOfRangeError } from '../errors/ownership-percentage-out-of-range.error';

/**
 * Value Object: participación de una persona sobre una unidad.
 * Distinto del Coefficient (coeficiente legal de copropiedad de la unidad):
 * varias personas pueden repartirse el 100% de la propiedad de una misma unidad.
 * Core business rule: la suma de porcentajes activos de una misma unidad debe ser 100%.
 */
export class OwnershipPercentage {
  private constructor(public readonly percentage: number) {}

  static create(percentage: number): OwnershipPercentage {
    if (percentage <= 0 || percentage > 100) {
      throw new OwnershipPercentageOutOfRangeError(percentage);
    }
    return new OwnershipPercentage(Number(percentage.toFixed(4)));
  }

  static sumIsHundred(percentages: OwnershipPercentage[]): boolean {
    const sum = percentages.reduce((acc, p) => acc + p.percentage, 0);
    return Math.abs(sum - 100) < 0.001;
  }
}
