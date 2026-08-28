import type { PropertyListItem } from "@/features/onboarding/api/onboarding.api";
import type { ManagedProperty } from "./adminPropertiesMock";

const TYPE_LABEL: Record<string, ManagedProperty["type"]> = {
  RESIDENCIAL: "Residencial",
  COMERCIAL: "Comercial",
  MIXTO: "Mixto",
};

const STATUS_LABEL: Record<string, ManagedProperty["status"]> = {
  EN_CONFIGURACION: "Configuración",
  PENDIENTE_REVISION: "En Onboarding",
  ACTIVO: "Activo",
};

// Campos sin equivalente real en el backend todavía (no hay módulo de
// planes/billing ni de PQRS): quedan en placeholder explícito, nunca
// inventados, hasta que esos módulos existan.
export function toManagedProperty(item: PropertyListItem): ManagedProperty {
  return {
    id: item.id,
    name: item.name,
    nit: item.taxId,
    city: item.city,
    type: TYPE_LABEL[item.type] ?? "Residencial",
    unitsCount: item.totalUnits,
    status: STATUS_LABEL[item.status] ?? "Configuración",
    plan: null,
    pendingBalance: 0,
    collectionPercentage: 0,
    overdueUnits: 0,
    pendingPqrs: 0,
    lastBackupDate: "—",
    imageAccent: "from-slate-500/20 to-slate-400/10 border-slate-500/30",
  };
}
