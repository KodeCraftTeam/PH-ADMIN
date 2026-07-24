"use client";

import { Alert, Badge, Button, Card, IconX, Input, Select } from "@/components/ui";
import { StepFooter } from "../components/StepFooter";
import { useWizardDispatch, useWizardState } from "../model/WizardContext";
import type { StructureRow, StructureType } from "../model/types";

const TYPES: StructureType[] = ["Torre", "Bloque", "Etapa", "Único"];

export function Step2Structure() {
  const { structure, property } = useWizardState();
  const dispatch = useWizardDispatch();

  const totalUnits = structure.reduce((acc, f) => acc + f.totalUnits, 0);
  const declared = Number(property.totalUnits) || 0;
  const matches = totalUnits === declared;

  function edit(
    id: string,
    field: keyof Omit<StructureRow, "id">,
    value: string | number
  ) {
    dispatch({ type: "EDIT_STRUCTURE_ROW", id, field, value });
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">
        Estructura del conjunto
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Define las torres, bloques o etapas. La suma de unidades debe coincidir con
        las <strong>{declared || "—"}</strong> declaradas en el paso anterior.
      </p>

      {!matches && (
        <div className="mt-4">
          <Alert tone="amber" title="Las unidades no coinciden">
            La estructura suma <strong>{totalUnits}</strong> unidades, pero en el
            paso 1 declaraste <strong>{declared}</strong>. Ajusta las filas o
            vuelve al paso anterior para corregir el total.
          </Alert>
        </div>
      )}

      <Card className="mt-5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Torre / bloque</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="w-28 px-4 py-3">Pisos</th>
              <th className="w-32 px-4 py-3">Unid. / piso</th>
              <th className="w-32 px-4 py-3">Unid. totales</th>
              <th className="w-14" />
            </tr>
          </thead>
          <tbody>
            {structure.map((f) => (
              <tr key={f.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2.5">
                  <Input
                    value={f.name}
                    onChange={(e) => edit(f.id, "name", e.target.value)}
                  />
                </td>
                <td className="px-4 py-2.5">
                  <Select
                    value={f.type}
                    onChange={(e) => edit(f.id, "type", e.target.value)}
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </td>
                <td className="px-4 py-2.5">
                  <Input
                    type="number"
                    min={1}
                    value={f.floors}
                    onChange={(e) => edit(f.id, "floors", Number(e.target.value) || 0)}
                  />
                </td>
                <td className="px-4 py-2.5">
                  <Input
                    type="number"
                    min={1}
                    value={f.unitsPerFloor}
                    onChange={(e) =>
                      edit(f.id, "unitsPerFloor", Number(e.target.value) || 0)
                    }
                  />
                </td>
                <td className="px-4 py-2.5 text-center font-medium text-slate-700">
                  {f.totalUnits}
                </td>
                <td className="px-2 py-2.5 text-center">
                  <Button
                    variant="danger"
                    className="!p-2"
                    title="Eliminar fila"
                    onClick={() => dispatch({ type: "REMOVE_STRUCTURE_ROW", id: f.id })}
                    disabled={structure.length === 1}
                  >
                    <IconX />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
          <Button
            variant="ghost"
            onClick={() => dispatch({ type: "ADD_STRUCTURE_ROW" })}
          >
            + Agregar fila
          </Button>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500">Total estructura:</span>
            <Badge tone={matches ? "green" : "amber"}>
              {totalUnits} / {declared || "—"} unidades
            </Badge>
          </div>
        </div>
      </Card>

      <StepFooter />
    </div>
  );
}
