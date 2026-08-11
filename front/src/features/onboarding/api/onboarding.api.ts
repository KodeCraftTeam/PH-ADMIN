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
      city: data.city,
      type: data.type || "Residencial",
      totalUnits: Number(data.totalUnits) || 1,
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
