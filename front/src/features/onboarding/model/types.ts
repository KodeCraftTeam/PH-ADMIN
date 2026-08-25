// Literal values stay in Spanish: they are rendered directly in the UI
// (dropdown options, badges) for the Colombian end user.
export type PropertyType = "Residencial" | "Comercial" | "Mixto";
export type StructureType = "Torre" | "Bloque" | "Etapa" | "Único";
export type BalanceStatus = "Al día" | "En mora" | "Acuerdo de pago";

export interface PropertyData {
  name: string;
  taxId: string;
  address: string;
  city: string;
  cityId: string;
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
  identifier: string; // e.g. Apto 501
  type: string; // APARTAMENTO | CASA | LOCAL | PARQUEADERO | DEPOSITO
  group: string | null; // agrupador (torre/manzana/etapa/sector)
  floor: number | null;
  areaM2: number;
  coefficient: number; // % de copropiedad
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
  coefficientSum: number;
  errors: ImportRowError[];
  units: ImportedUnit[];
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
  propertyId: string | null; // id real devuelto por el backend al guardar el paso 1
  property: PropertyData;
  structure: StructureRow[];
  importFile: File | null;
  importPreview: ImportResult | null; // último resultado de preview/commit (incluye errores)
  importCommitted: boolean; // true una vez que el commit persistió en el backend
  balance: BalanceRow[];
  balanceLoaded: boolean;
  activated: boolean;
}

export type WizardAction =
  { type: "GO_TO_STEP"; step: number }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SET_PROPERTY"; field: keyof PropertyData; value: string }
  | { type: "SET_PROPERTY_ID"; id: string }
  | { type: "ADD_STRUCTURE_ROW" }
  | { type: "REMOVE_STRUCTURE_ROW"; id: string }
  | {
      type: "EDIT_STRUCTURE_ROW";
      id: string;
      field: keyof Omit<StructureRow, "id">;
      value: string | number;
    }
  | { type: "SET_IMPORT_FILE"; file: File }
  | { type: "SET_IMPORT_PREVIEW"; result: ImportResult }
  | { type: "REMOVE_IMPORT_FILE" }
  | { type: "SET_IMPORT_COMMITTED"; result: ImportResult }
  | { type: "LOAD_BALANCE" }
  | {
      type: "EDIT_BALANCE_ROW";
      id: string;
      field: keyof Omit<BalanceRow, "id" | "code" | "owner">;
      value: string | number;
    }
  | { type: "ACTIVATE_PROPERTY" };
