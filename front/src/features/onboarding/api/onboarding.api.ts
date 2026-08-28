import { apiRequest } from "@/lib/http-client";
import type {
  BalanceImportResult,
  CoefficientImportResult,
  ImportResult,
  OnboardingStatus,
  PropertyData,
} from "../model/types";

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

export function getOnboardingStatus(propertyId: string) {
  return apiRequest<OnboardingStatus>(
    `/onboarding/properties/${propertyId}/status`
  );
}

export function previewUnitsImport(propertyId: string, file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiRequest<ImportResult>(
    `/onboarding/properties/${propertyId}/units/import/preview`,
    { method: "POST", body }
  );
}

export function commitUnitsImport(propertyId: string, file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiRequest<ImportResult>(
    `/onboarding/properties/${propertyId}/units/import`,
    { method: "POST", body }
  );
}

export function previewCoefficientsImport(propertyId: string, file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiRequest<CoefficientImportResult>(
    `/onboarding/properties/${propertyId}/coefficients/import/preview`,
    { method: "POST", body }
  );
}

export function commitCoefficientsImport(propertyId: string, file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiRequest<CoefficientImportResult>(
    `/onboarding/properties/${propertyId}/coefficients/import`,
    { method: "POST", body }
  );
}

export function previewBalanceImport(propertyId: string, file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiRequest<BalanceImportResult>(
    `/onboarding/properties/${propertyId}/balance/import/preview`,
    { method: "POST", body }
  );
}

export function commitBalanceImport(propertyId: string, file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiRequest<BalanceImportResult>(
    `/onboarding/properties/${propertyId}/balance/import`,
    { method: "POST", body }
  );
}
