import { InitialBalance } from '../../entities/balance.entity';

export interface BalanceRepository {
  saveBatch(balances: InitialBalance[]): Promise<void>;
  listByProperty(propertyId: string): Promise<InitialBalance[]>;
}

export const BALANCE_REPOSITORY = Symbol('BalanceRepository');
