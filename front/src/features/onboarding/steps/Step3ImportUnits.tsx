"use client";

import { useState } from "react";
import { Badge, Button, Card } from "@/components/ui";
import { StepFooter } from "../components/StepFooter";
import { useWizardDispatch, useWizardState } from "../model/WizardContext";

export function Step3ImportUnits() {
  const { unitsUploaded, units } = useWizardState();
  const dispatch = useWizardDispatch();
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simulates reading the Excel file: small delay to feel real
  function simulateUpload() {
    if (loading || unitsUploaded) return;
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: "UPLOAD_UNITS_FILE" });
      setLoading(false);
    }, 900);
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Importar unidades</h1>
      <p className="mt-1 text-sm text-slate-500">
        Sube el archivo con las unidades, coeficientes y propietarios. Usa nuestra
        plantilla para evitar errores de formato.
      </p>

      <div className="mt-3">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-sm font-medium text-ph-700 underline-offset-2 hover:underline"
        >
          Descargar plantilla (plantilla_unidades.xlsx)
        </a>
      </div>

      {!unitsUploaded ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            simulateUpload();
          }}
          onClick={simulateUpload}
          className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
            dragging
              ? "border-ph-500 bg-ph-50"
              : "border-slate-300 bg-white hover:border-ph-400 hover:bg-ph-50/40"
          }`}
        >
          {loading ? (
            <>
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-ph-200 border-t-ph-600" />
              <p className="mt-4 text-sm font-medium text-slate-700">
                Leyendo unidades_altos_virrey.xlsx…
              </p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ph-100 text-2xl">
                📄
              </div>
              <p className="mt-4 text-sm font-medium text-slate-700">
                Arrastra tu archivo aquí, o{" "}
                <span className="text-ph-700">selecciona un archivo</span>
              </p>
              <p className="mt-1 text-xs text-slate-400">.xlsx o .csv — máx. 5 MB</p>
            </>
          )}
        </div>
      ) : (
        <>
          <Card className="mt-5 flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">📄</span>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  unidades_altos_virrey.xlsx
                </p>
                <p className="text-xs text-slate-400">
                  24 KB · {units.length} filas detectadas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone="blue">Vista previa</Badge>
              <Button
                variant="ghost"
                onClick={() => dispatch({ type: "REMOVE_UNITS_FILE" })}
              >
                Quitar archivo
              </Button>
            </div>
          </Card>

          <Card className="mt-4 overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0">
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2.5">Unidad</th>
                    <th className="px-4 py-2.5">Torre</th>
                    <th className="px-4 py-2.5">Tipo</th>
                    <th className="px-4 py-2.5 text-right">Área (m²)</th>
                    <th className="px-4 py-2.5 text-right">Coef. (%)</th>
                    <th className="px-4 py-2.5">Propietario</th>
                    <th className="px-4 py-2.5">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((u) => (
                    <tr key={u.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2 font-medium text-slate-800">{u.code}</td>
                      <td className="px-4 py-2 text-slate-600">{u.tower}</td>
                      <td className="px-4 py-2 text-slate-600">{u.type}</td>
                      <td className="px-4 py-2 text-right text-slate-600">
                        {u.area.toFixed(1)}
                      </td>
                      <td className="px-4 py-2 text-right text-slate-600">
                        {u.coefficient.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-slate-600">{u.owner}</td>
                      <td className="px-4 py-2 text-slate-500">{u.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <StepFooter
        canAdvance={unitsUploaded}
        nextLabel="Confirmar e importar"
        onAdvance={() => {
          dispatch({ type: "CONFIRM_IMPORT" });
          return true;
        }}
      />
    </div>
  );
}
