// Literal values stay in Spanish: they are rendered directly in the UI
// (dropdown options, badges) for the Colombian end user.
export type PropertyType = "Residencial" | "Comercial" | "Mixto";
export type StructureType = "Torre" | "Bloque" | "Etapa" | "Único";
export type BalanceStatus = "Al día" | "En mora" | "Acuerdo de pago";
export type ValidationStatus = "ok" | "error";

export interface PropertyData {
  name: string;
  taxId: string;
  address: string;
  city: string;
  type: PropertyType | "";
  totalUnits: string;
  totalTowers: string;
  adminName: string;
  adminEmail: string;
}

export interface StructureRow {
  id: string;
  name: string;
  type: StructureType;
  floors: number;
  unitsPerFloor: number;
  totalUnits: number;
}

export interface ImportedUnit {
  id: string;
  code: string; // e.g. T1-101
  tower: string;
  type: "Apartamento" | "Local" | "Parqueadero" | "Depósito";
  area: number; // m2
  coefficient: number; // % co-ownership
  owner: string;
  idNumber: string;
  email: string;
  phone: string;
  status: ValidationStatus;
  errorDetail?: string;
}

export interface BalanceRow {
  id: string;
  code: string;
  owner: string;
  initialBalance: number;
  cutoffDate: string;
  status: BalanceStatus;
}

export interface WizardState {
  step: number; // 1..6
  completedSteps: number[];
  property: PropertyData;
  structure: StructureRow[];
  unitsUploaded: boolean; // step 3: file "uploaded"
  unitsConfirmed: boolean; // step 3: preview confirmed
  units: ImportedUnit[];
  validationFixed: boolean;
  balance: BalanceRow[];
  balanceLoaded: boolean;
  activated: boolean;
}

export type WizardAction =
  | { type: "GO_TO_STEP"; step: number }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SET_PROPERTY"; field: keyof PropertyData; value: string }
  | { type: "ADD_STRUCTURE_ROW" }
  | { type: "REMOVE_STRUCTURE_ROW"; id: string }
  | {
      type: "EDIT_STRUCTURE_ROW";
      id: string;
      field: keyof Omit<StructureRow, "id">;
      value: string | number;
    }
  | { type: "UPLOAD_UNITS_FILE" }
  | { type: "REMOVE_UNITS_FILE" }
  | { type: "CONFIRM_IMPORT" }
  | { type: "FIX_ERRORS" }
  | { type: "LOAD_BALANCE" }
  | {
      type: "EDIT_BALANCE_ROW";
      id: string;
      field: keyof Omit<BalanceRow, "id" | "code" | "owner">;
      value: string | number;
    }
  | { type: "ACTIVATE_PROPERTY" };
