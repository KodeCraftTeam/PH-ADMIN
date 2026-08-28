export interface PropertyOverviewReadModel {
  pendingBalanceTotal: number;
  unitsWithBalance: number;
  overdueUnits: number;
  paymentPlanUnits: number;
  totalUnits: number;
  unitsByType: Record<string, number>;
}
