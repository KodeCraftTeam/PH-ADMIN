import { CoefficientOutOfRangeError } from '../errors/coefficient-out-of-range.error';

/**
 * Value Object: co-ownership coefficient (percentage).
 * Core business rule: the sum of all coefficients in a property
 * must equal exactly 100%.
 */
export class Coefficient {
  private constructor(public readonly percentage: number) {}

  static create(percentage: number): Coefficient {
    if (percentage <= 0 || percentage > 100) {
      throw new CoefficientOutOfRangeError(percentage);
    }
    return new Coefficient(Number(percentage.toFixed(4)));
  }

  static sumIsHundred(coefficients: Coefficient[]): boolean {
    const sum = coefficients.reduce((acc, c) => acc + c.percentage, 0);
    return Math.abs(sum - 100) < 0.001;
  }
}
