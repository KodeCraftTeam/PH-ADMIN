const UNIT_TYPE_LABEL: Record<string, { one: string; many: string }> = {
  APARTAMENTO: { one: "apto", many: "aptos" },
  CASA: { one: "casa", many: "casas" },
  LOCAL: { one: "local comercial", many: "locales comerciales" },
  PARQUEADERO: { one: "parqueadero", many: "parqueaderos" },
  DEPOSITO: { one: "depósito", many: "depósitos" },
};

// ej: { APARTAMENTO: 16, LOCAL: 2 } -> "16 aptos • 2 locales comerciales"
export function formatUnitTypeBreakdown(
  unitsByType: Record<string, number>
): string {
  const parts = Object.entries(unitsByType)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => {
      const label = UNIT_TYPE_LABEL[type];
      if (!label) return `${count} ${type.toLowerCase()}`;
      return `${count} ${count === 1 ? label.one : label.many}`;
    });

  return parts.join(" • ");
}
