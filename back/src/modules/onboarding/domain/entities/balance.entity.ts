export type BalanceStatus = 'AL_DIA' | 'EN_MORA' | 'ACUERDO_DE_PAGO';

export class InitialBalance {
  constructor(
    public readonly id: string,
    public readonly unitId: string,
    public readonly balanceCOP: number,
    public readonly cutoffDate: Date,
    public readonly status: BalanceStatus,
  ) {}
}
