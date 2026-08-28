// Los valores literales quedan en español: se renderizan directo en la UI
// (opciones de dropdown, badges) para el usuario final colombiano.
export type PropertyType = "Residencial" | "Comercial" | "Mixto";

// BalanceStatus/BalanceRow: forma del fixture que usa la vista mock de
// facturación admin (features/admin/views/AdminBillingView.tsx) — ya no la
// usa el wizard, que carga saldos reales vía el endpoint /balance/import.
export type BalanceStatus = "Al día" | "En mora" | "Acuerdo de pago";

export interface BalanceRow {
  id: string;
  code: string;
  owner: string;
  initialBalance: number;
  cutoffDate: string;
  status: BalanceStatus;
}

export interface PropertyData {
  name: string;
  taxId: string;
  address: string;
  city: string;
  cityId: string;
  type: PropertyType | "";
  totalUnits: string;
  adminName: string;
  adminEmail: string;
}

export interface ImportedUnit {
  identifier: string; // e.g. Apto 501
  type: string; // APARTAMENTO | CASA | LOCAL | PARQUEADERO | DEPOSITO
  group: string | null; // agrupador (torre/manzana/etapa/sector)
  floor: number | null;
  areaM2: number;
  matricula: string | null;
  use: string | null; // RESIDENCIAL | COMERCIAL | MIXTO
}

export interface ImportRowError {
  sheet: "Unidades" | "Personas" | "Propietarios";
  row: number; // 0 = error transversal, no de una fila puntual
  message: string;
}

export interface ImportResult {
  committed: boolean;
  totalUnits: number;
  totalPersons: number;
  totalOwnerships: number;
  errors: ImportRowError[];
  units: ImportedUnit[];
}

export interface CoefficientImportRowError {
  sheet: "Coeficientes";
  row: number;
  message: string;
}

export interface CoefficientPreviewRow {
  identifier: string;
  coefficient: number;
  origin: string;
}

export interface CoefficientImportResult {
  committed: boolean;
  totalUpdated: number;
  coefficientSum: number;
  errors: CoefficientImportRowError[];
  coefficients: CoefficientPreviewRow[];
}

export interface BalanceImportRowIssue {
  sheet: "Saldos";
  row: number;
  message: string;
}

export interface BalancePreviewRow {
  identifier: string;
  balanceCOP: number;
  cutoffDate: string;
  status: string;
}

export interface BalanceImportResult {
  committed: boolean;
  totalUpserted: number;
  errors: BalanceImportRowIssue[];
  warnings: BalanceImportRowIssue[];
  balances: BalancePreviewRow[];
}

export interface OnboardingStatus {
  units: {
    complete: boolean;
    loaded: number;
    declared: number;
    mismatch: boolean;
  };
  owners: { complete: boolean; total: number; withoutOwner: number };
  coefficients: { complete: boolean; currentSum: number };
  balances: { complete: boolean; loaded: number; total: number };
  canActivate: boolean;
}

export interface WizardState {
  step: number; // 1..7
  completedSteps: number[];
  propertyId: string | null; // id real devuelto por el backend al guardar el paso 1
  property: PropertyData;
  importFile: File | null;
  importPreview: ImportResult | null; // último resultado de preview/commit (incluye errores)
  importCommitted: boolean; // true una vez que el commit persistió en el backend
  coefficientsFile: File | null;
  coefficientsPreview: CoefficientImportResult | null;
  coefficientsCommitted: boolean;
  balanceFile: File | null;
  balancePreview: BalanceImportResult | null;
  balanceCommitted: boolean;
  status: OnboardingStatus | null; // última lectura real de GET /estado
  activated: boolean;
}

export type WizardAction =
  { type: "GO_TO_STEP"; step: number }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SET_PROPERTY"; field: keyof PropertyData; value: string }
  | { type: "SET_PROPERTY_ID"; id: string }
  | { type: "SET_IMPORT_FILE"; file: File }
  | { type: "SET_IMPORT_PREVIEW"; result: ImportResult }
  | { type: "REMOVE_IMPORT_FILE" }
  | { type: "SET_IMPORT_COMMITTED"; result: ImportResult }
  | { type: "SET_COEFFICIENTS_FILE"; file: File }
  | { type: "SET_COEFFICIENTS_PREVIEW"; result: CoefficientImportResult }
  | { type: "REMOVE_COEFFICIENTS_FILE" }
  | { type: "SET_COEFFICIENTS_COMMITTED"; result: CoefficientImportResult }
  | { type: "SET_BALANCE_FILE"; file: File }
  | { type: "SET_BALANCE_PREVIEW"; result: BalanceImportResult }
  | { type: "REMOVE_BALANCE_FILE" }
  | { type: "SET_BALANCE_COMMITTED"; result: BalanceImportResult }
  | { type: "SET_STATUS"; status: OnboardingStatus }
  | { type: "ACTIVATE_PROPERTY" };
