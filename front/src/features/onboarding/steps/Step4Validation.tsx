"use client";

import { Alert, Badge, Card, IconCheck, IconX } from "@/components/ui";
import { StepFooter } from "../components/StepFooter";
import { useWizardDispatch, useWizardState } from "../model/WizardContext";
import { commitUnitsImport } from "../api/onboarding.api";
import { ApiError } from "@/lib/http-client";
import type { ImportRowError } from "../model/types";

export function Step4Validation() {
  const { propertyId, importFile, importPreview, importCommitted } = useWizardState();
  const dispatch = useWizardDispatch();

  const errors = importPreview?.errors ?? [];
  const hasCleanPreview = !!importPreview && errors.length === 0;
  const sumOk = importPreview ? Math.abs(importPreview.coefficientSum - 100) < 0.01 : false;

  async function handleConfirm(): Promise<boolean> {
    if (!propertyId || !importFile) return false;

    try {
      const result = await commitUnitsImport(propertyId, importFile);
      dispatch({ type: "SET_IMPORT_COMMITTED", result });
      return true;
    } catch (err) {
      const details =
        err instanceof ApiError && Array.isArray(err.details)
          ? (err.details as ImportRowError[])
          : [{ sheet: "Unidades" as const, row: 0, message: (err as Error).message }];
      dispatch({
        type: "SET_IMPORT_PREVIEW",
        result: {
          committed: false,
          totalUnits: importPreview?.totalUnits ?? 0,
          totalPersons: importPreview?.totalPersons ?? 0,
          totalOwnerships: importPreview?.totalOwnerships ?? 0,
          coefficientSum: importPreview?.coefficientSum ?? 0,
          units: importPreview?.units ?? [],
          errors: details,
        },
      });
      return false;
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Validación automática</h1>
      <p className="mt-1 text-sm text-slate-500">
        Revisamos las 3 hojas del archivo (unidades, personas y propietarios). Solo
        puedes continuar cuando todo esté en verde.
      </p>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Unidades
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {importPreview?.totalUnits ?? 0}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Personas nuevas
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {importPreview?.totalPersons ?? 0}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Suma de coeficientes
          </p>
          <p
            className={`mt-1 text-2xl font-semibold ${
              sumOk ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {(importPreview?.coefficientSum ?? 0).toFixed(2)}%
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Estado general
          </p>
          <div className="mt-2">
            {hasCleanPreview ? (
              <Badge tone="green">
                <IconCheck className="h-3 w-3" /> Todo listo
              </Badge>
            ) : (
              <Badge tone="red">
                <IconX className="h-3 w-3" /> {errors.length} error(es)
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {importCommitted && (
        <div className="mt-4">
          <Alert tone="green" title="Importación completada">
            Se importaron {importPreview?.totalUnits ?? 0} unidades,{" "}
            {importPreview?.totalOwnerships ?? 0} vínculos de propiedad.
          </Alert>
        </div>
      )}

      {!hasCleanPreview && !importCommitted && (
        <div className="mt-4">
          <Alert tone="blue" title="¿No sabes cómo corregirlo?">
            Corrige el Excel según los errores de abajo y vuelve a subirlo en el paso
            anterior — mientras haya errores no se importa nada.
          </Alert>
        </div>
      )}

      {errors.length > 0 && (
        <Card className="mt-4 overflow-hidden">
          <div className="max-h-96 overflow-auto divide-y divide-slate-100">
            {errors.map((e, i) => (
              <div key={i} className="px-4 py-2.5 text-sm">
                <span className="font-medium text-slate-700">
                  {e.sheet}
                  {e.row > 0 ? ` · fila ${e.row}` : ""}
                </span>
                <span className="ml-2 text-red-600">{e.message}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <StepFooter
        canAdvance={importCommitted || hasCleanPreview}
        nextLabel={importCommitted ? "Continuar" : "Confirmar e importar"}
        onAdvance={importCommitted ? undefined : handleConfirm}
      />
    </div>
  );
}
