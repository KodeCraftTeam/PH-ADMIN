import { Coefficient } from '../../../domain/value-objects/coefficient.vo';

export interface UnitStatusOwnershipRow {
  percentage: number;
  isPrimary: boolean;
}

export interface UnitStatusRow {
  identifier: string;
  coefficient: Coefficient | null;
  ownerships: UnitStatusOwnershipRow[];
}

export interface OnboardingStatusContext {
  units: UnitStatusRow[];
  balancesCount: number;
}

export interface OnboardingStatusQueryPort {
  loadContext(communityId: string): Promise<OnboardingStatusContext>;
}

export const ONBOARDING_STATUS_QUERY_PORT = Symbol('OnboardingStatusQueryPort');
