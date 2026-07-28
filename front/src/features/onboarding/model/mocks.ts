import type { BalanceRow, ImportedUnit, StructureRow } from "./types";

// Mock dataset: simulates the content of "units_template.xlsx"
// 18 units for Conjunto Residencial Altos del Virrey (Bogotá).
// 4 rows arrive with errors to demonstrate automatic validation.
export const UNITS_MOCK: ImportedUnit[] = [
  { id: "u01", code: "T1-101", tower: "Torre 1", type: "Apartamento", area: 68.5, coefficient: 4.94, owner: "María Fernanda Rojas", idNumber: "52.841.903", email: "mafe.rojas@gmail.com", phone: "310 456 7821", status: "ok" },
  { id: "u02", code: "T1-102", tower: "Torre 1", type: "Apartamento", area: 72.0, coefficient: 5.20, owner: "Carlos Andrés Peña", idNumber: "79.634.512", email: "capena72@hotmail.com", phone: "301 782 4455", status: "ok" },
  { id: "u03", code: "T1-201", tower: "Torre 1", type: "Apartamento", area: 68.5, coefficient: 4.94, owner: "Luz Marina Gutiérrez", idNumber: "41.720.331", email: "luzmarina.g@yahoo.com", phone: "315 220 9034", status: "ok" },
  { id: "u04", code: "T1-202", tower: "Torre 1", type: "Apartamento", area: 72.0, coefficient: 5.20, owner: "Jorge Iván Castaño", idNumber: "80.112.457", email: "jorgecastano#gmail.com", phone: "300 118 6742", status: "error", errorDetail: "Email inválido: 'jorgecastano#gmail.com'" },
  { id: "u05", code: "T1-301", tower: "Torre 1", type: "Apartamento", area: 68.5, coefficient: 4.94, owner: "Sandra Milena Ortiz", idNumber: "63.502.918", email: "sandra.ortiz@outlook.com", phone: "312 664 8890", status: "ok" },
  { id: "u06", code: "T1-302", tower: "Torre 1", type: "Apartamento", area: 72.0, coefficient: 5.20, owner: "Ricardo Sarmiento", idNumber: "19.455.208", email: "rsarmiento55@gmail.com", phone: "320 903 1276", status: "ok" },
  { id: "u07", code: "T2-101", tower: "Torre 2", type: "Apartamento", area: 85.2, coefficient: 6.15, owner: "Ana Lucía Bermúdez", idNumber: "39.784.601", email: "analucia.bermudez@gmail.com", phone: "311 542 7788", status: "ok" },
  { id: "u08", code: "T2-102", tower: "Torre 2", type: "Apartamento", area: 85.2, coefficient: 6.15, owner: "Óscar Mauricio Lara", idNumber: "79.998.114", email: "omlara@empresa.com.co", phone: "313 407 5561", status: "ok" },
  { id: "u09", code: "T2-201", tower: "Torre 2", type: "Apartamento", area: 85.2, coefficient: 6.15, owner: "Patricia Cifuentes", idNumber: "51.663.470", email: "paty.cifuentes@gmail.com", phone: "314 889 2203", status: "ok" },
  { id: "u10", code: "T2-201", tower: "Torre 2", type: "Apartamento", area: 85.2, coefficient: 6.15, owner: "Hernán Darío Vélez", idNumber: "71.334.892", email: "hdvelez@gmail.com", phone: "318 225 6640", status: "error", errorDetail: "Identificador de unidad repetido: 'T2-201' ya existe" },
  { id: "u11", code: "T2-301", tower: "Torre 2", type: "Apartamento", area: 85.2, coefficient: 6.15, owner: "Claudia Ximena Prado", idNumber: "52.017.556", email: "cxprado@hotmail.com", phone: "316 731 0945", status: "ok" },
  { id: "u12", code: "T2-302", tower: "Torre 2", type: "Apartamento", area: 85.2, coefficient: 4.94, owner: "Felipe Núñez Caballero", idNumber: "1.020.771.348", email: "felipe.nunez@gmail.com", phone: "319 640 2287", status: "error", errorDetail: "Coeficiente duplicado con T1-101 (4.94%) — verifique la tabla de coeficientes" },
  { id: "u13", code: "T3-101", tower: "Torre 3", type: "Apartamento", area: 92.4, coefficient: 6.67, owner: "Gloria Inés Manrique", idNumber: "41.209.885", email: "gloria.manrique@yahoo.es", phone: "317 350 8812", status: "ok" },
  { id: "u14", code: "T3-102", tower: "Torre 3", type: "Apartamento", area: 92.4, coefficient: 6.67, owner: "Andrés Felipe Zuluaga", idNumber: "1.010.234.907", email: "afzuluaga@gmail.com", phone: "321 118 4457", status: "ok" },
  { id: "u15", code: "T3-201", tower: "Torre 3", type: "Apartamento", area: 92.4, coefficient: 6.67, owner: "Beatriz Elena Quintero", idNumber: "43.556.201", email: "bequintero@outlook.com", phone: "322 903 6671", status: "ok" },
  { id: "u16", code: "T3-202", tower: "Torre 3", type: "Apartamento", area: 92.4, coefficient: 0, owner: "Mauricio Pardo León", idNumber: "79.401.663", email: "mpardo.leon@gmail.com", phone: "323 415 7789", status: "error", errorDetail: "Coeficiente vacío o en cero — toda unidad debe tener coeficiente" },
  { id: "u17", code: "L-001", tower: "Zona comercial", type: "Local", area: 45.0, coefficient: 3.25, owner: "Inversiones El Nogal S.A.S.", idNumber: "900.482.113-7", email: "admin@elnogal.co", phone: "601 745 2210", status: "ok" },
  { id: "u18", code: "L-002", tower: "Zona comercial", type: "Local", area: 38.6, coefficient: 2.75, owner: "Panadería La Espiga Dorada", idNumber: "901.220.874-1", email: "laespigadorada@gmail.com", phone: "601 388 9034", status: "ok" },
];

// Corrections applied by the demo when clicking "Corregir y reintentar".
// The corrected coefficients make the total sum exactly 100.00%.
export const CORRECTIONS: Record<string, Partial<ImportedUnit>> = {
  u04: { email: "jorgecastano@gmail.com", status: "ok", errorDetail: undefined },
  u10: { code: "T2-202", status: "ok", errorDetail: undefined },
  u12: { coefficient: 6.15, status: "ok", errorDetail: undefined },
  u16: { coefficient: 6.67, status: "ok", errorDetail: undefined },
};

export function sumCoefficients(units: ImportedUnit[]): number {
  return Number(units.reduce((acc, u) => acc + u.coefficient, 0).toFixed(2));
}

// Initial balance mock: generated from the already-corrected units.
export const BALANCE_MOCK: BalanceRow[] = [
  { id: "c01", code: "T1-101", owner: "María Fernanda Rojas", initialBalance: 0, cutoffDate: "2026-06-30", status: "Al día" },
  { id: "c02", code: "T1-102", owner: "Carlos Andrés Peña", initialBalance: 486000, cutoffDate: "2026-06-30", status: "En mora" },
  { id: "c03", code: "T1-201", owner: "Luz Marina Gutiérrez", initialBalance: 0, cutoffDate: "2026-06-30", status: "Al día" },
  { id: "c04", code: "T1-202", owner: "Jorge Iván Castaño", initialBalance: 972000, cutoffDate: "2026-06-30", status: "En mora" },
  { id: "c05", code: "T1-301", owner: "Sandra Milena Ortiz", initialBalance: 0, cutoffDate: "2026-06-30", status: "Al día" },
  { id: "c06", code: "T1-302", owner: "Ricardo Sarmiento", initialBalance: 243000, cutoffDate: "2026-06-30", status: "Acuerdo de pago" },
  { id: "c07", code: "T2-101", owner: "Ana Lucía Bermúdez", initialBalance: 0, cutoffDate: "2026-06-30", status: "Al día" },
  { id: "c08", code: "T2-102", owner: "Óscar Mauricio Lara", initialBalance: 0, cutoffDate: "2026-06-30", status: "Al día" },
  { id: "c09", code: "T2-201", owner: "Patricia Cifuentes", initialBalance: 1240000, cutoffDate: "2026-06-30", status: "En mora" },
  { id: "c10", code: "T2-202", owner: "Hernán Darío Vélez", initialBalance: 0, cutoffDate: "2026-06-30", status: "Al día" },
  { id: "c11", code: "T2-301", owner: "Claudia Ximena Prado", initialBalance: 0, cutoffDate: "2026-06-30", status: "Al día" },
  { id: "c12", code: "T2-302", owner: "Felipe Núñez Caballero", initialBalance: 310000, cutoffDate: "2026-06-30", status: "Acuerdo de pago" },
  { id: "c13", code: "T3-101", owner: "Gloria Inés Manrique", initialBalance: 0, cutoffDate: "2026-06-30", status: "Al día" },
  { id: "c14", code: "T3-102", owner: "Andrés Felipe Zuluaga", initialBalance: 0, cutoffDate: "2026-06-30", status: "Al día" },
  { id: "c15", code: "T3-201", owner: "Beatriz Elena Quintero", initialBalance: 655000, cutoffDate: "2026-06-30", status: "En mora" },
  { id: "c16", code: "T3-202", owner: "Mauricio Pardo León", initialBalance: 0, cutoffDate: "2026-06-30", status: "Al día" },
  { id: "c17", code: "L-001", owner: "Inversiones El Nogal S.A.S.", initialBalance: 0, cutoffDate: "2026-06-30", status: "Al día" },
  { id: "c18", code: "L-002", owner: "Panadería La Espiga Dorada", initialBalance: 128000, cutoffDate: "2026-06-30", status: "En mora" },
];

export const INITIAL_STRUCTURE: StructureRow[] = [
  { id: "e1", name: "Torre 1", type: "Torre", floors: 3, unitsPerFloor: 2, totalUnits: 6 },
];

export function newStructureRow(n: number): StructureRow {
  return {
    id: `e${Date.now()}`,
    name: `Torre ${n}`,
    type: "Torre",
    floors: 1,
    unitsPerFloor: 1,
    totalUnits: 1,
  };
}
