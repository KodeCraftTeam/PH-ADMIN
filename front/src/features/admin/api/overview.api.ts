import { apiRequest } from "@/lib/http-client";

export interface PropertyOverview {
  pendingBalanceTotal: number;
  unitsWithBalance: number;
  overdueUnits: number;
  paymentPlanUnits: number;
  totalUnits: number;
  unitsByType: Record<string, number>;
}

export function getPropertyOverview(propertyId: string) {
  return apiRequest<PropertyOverview>(
    `/onboarding/properties/${propertyId}/overview`
  );
}
