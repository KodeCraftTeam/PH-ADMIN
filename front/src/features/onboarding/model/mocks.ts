import type { BalanceRow, StructureRow } from "./types";

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
