import { InitialBalance } from '../../entities/balance.entity';

export interface UnitIdentifierRow {
  id: string;
  identifier: string;
}

export interface BalanceRepository {
  loadUnitIdentifiers(communityId: string): Promise<UnitIdentifierRow[]>;
  upsertBatch(balances: InitialBalance[]): Promise<void>;
  listByProperty(propertyId: string): Promise<InitialBalance[]>;
}

export const BALANCE_REPOSITORY = Symbol('BalanceRepository');
