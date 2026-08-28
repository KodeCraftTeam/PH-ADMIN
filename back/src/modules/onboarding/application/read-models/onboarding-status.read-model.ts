export interface UnitsStatus {
  complete: boolean;
  loaded: number;
  declared: number;
  mismatch: boolean;
}

export interface OwnersStatus {
  complete: boolean;
  total: number;
  withoutOwner: number;
}

export interface CoefficientsStatus {
  complete: boolean;
  currentSum: number;
}

export interface BalancesStatus {
  complete: boolean;
  loaded: number;
  total: number;
}

export interface OnboardingStatus {
  units: UnitsStatus;
  owners: OwnersStatus;
  coefficients: CoefficientsStatus;
  balances: BalancesStatus;
  canActivate: boolean;
}
