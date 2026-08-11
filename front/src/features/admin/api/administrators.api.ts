import { apiRequest } from "@/lib/http-client";

export interface CityItem {
  id: string;
  name: string;
}

export interface RegisterAdministratorPayload {
  personType: "NATURAL" | "JURIDICA";
  nameOrBusinessName: string;
  taxId: string;
  cityId: string;
  phoneNumber?: string;
  address?: string;
  legalRepresentative?: string;
}

export async function getCities(): Promise<CityItem[]> {
  return apiRequest<CityItem[]>("/cities");
}

export async function registerAdministrator(
  payload: RegisterAdministratorPayload
): Promise<{ id: string }> {
  return apiRequest<{ id: string }>("/administrators/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
