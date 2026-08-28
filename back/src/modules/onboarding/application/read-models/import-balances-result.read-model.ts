import { BalanceImportRowIssue } from '../../domain/errors/balance-import-row-error';

export type { BalanceImportRowIssue };

export interface BalancePreviewRow {
  identifier: string;
  balanceCOP: number;
  cutoffDate: string;
  status: string;
}

export interface ImportBalancesResult {
  committed: boolean;
  totalUpserted: number;
  errors: BalanceImportRowIssue[];
  warnings: BalanceImportRowIssue[];
  balances: BalancePreviewRow[];
}
