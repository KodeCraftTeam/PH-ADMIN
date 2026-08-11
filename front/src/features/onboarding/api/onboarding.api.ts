import { apiRequest } from "@/lib/http-client";
import type { PropertyData } from "../model/types";

export interface PropertyListItem {
  id: string;
  name: string;
  taxId: string;
  address: string;
  city: string;
  type: string;
  totalUnits: number;
  status: string;
}

export function saveProperty(data: PropertyData & { id?: string }) {
  return apiRequest<{ id: string }>("/onboarding/properties", {
    method: "POST",
    body: JSON.stringify({
      id: data.id,
      name: data.name,
      taxId: data.taxId,
      address: data.address,
      cityId: data.cityId,
      type: (data.type || "Residencial").toUpperCase(),
      totalUnits: Number(data.totalUnits) || 1,
      totalTowers: Number(data.totalTowers) || 1,
      adminName: data.adminName,
      adminEmail: data.adminEmail,
    }),
  });
}

export function getAdministratorProperties() {
  return apiRequest<PropertyListItem[]>("/onboarding/properties");
}

export function activateProperty(id: string) {
  return apiRequest(`/onboarding/properties/${id}/activate`, {
    method: "POST",
  });
}
