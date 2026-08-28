"use client";

import { Alert, Badge, Card, IconCheck, IconX } from "@/components/ui";
import { StepFooter } from "../components/StepFooter";
import { useWizardDispatch, useWizardState } from "../model/WizardContext";
import { commitUnitsImport, getOnboardingStatus } from "../api/onboarding.api";
import { ApiError } from "@/lib/http-client";
import type { ImportRowError } from "../model/types";

export function Step3Validation() {
  const { propertyId, importFile, importPreview, importCommitted } = useWizardState();
  const dispatch = useWizardDispatch();

  const errors = importPreview?.errors ?? [];
  const hasCleanPreview = !!importPreview && errors.length === 0;

  async function handleConfirm(): Promise<boolean> {
    if (!propertyId || !importFile) return false;

    try {
      const result = await commitUnitsImport(propertyId, importFile);
      dispatch({ type: "SET_IMPORT_COMMITTED", result });
      try {
        const status = await getOnboardingStatus(propertyId);
        dispatch({ type: "SET_STATUS", status });
      } catch {
        // el estado se puede refrescar más adelante; no bloquea el flujo
      }
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
          units: importPreview?.units ?? [],
          errors: details,
        },
      });
      return false;
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">Validación automática</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
        Revisamos las 3 hojas del archivo (unidades, personas y propietarios). Solo
        puedes continuar cuando todo esté en verde.
      </p>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-zinc-500">
            Unidades
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-zinc-100">
            {importPreview?.totalUnits ?? 0}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-zinc-500">
            Personas nuevas
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-zinc-100">
            {importPreview?.totalPersons ?? 0}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-zinc-500">
            Vínculos de propiedad
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-zinc-100">
            {importPreview?.totalOwnerships ?? 0}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-zinc-500">
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
            {importPreview?.totalOwnerships ?? 0} vínculos de propiedad. El siguiente
            paso es cargar los coeficientes de copropiedad.
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
          <div className="max-h-96 overflow-auto divide-y divide-slate-100 dark:divide-zinc-800">
            {errors.map((e, i) => (
              <div key={i} className="px-4 py-2.5 text-sm">
                <span className="font-medium text-slate-700 dark:text-zinc-300">
                  {e.sheet}
                  {e.row > 0 ? ` · fila ${e.row}` : ""}
                </span>
                <span className="ml-2 text-red-600 dark:text-red-400">{e.message}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <StepFooter
        canAdvance={importCommitted || hasCleanPreview}
        nextLabel={importCommitted ? "Continuar a coeficientes" : "Confirmar e importar"}
        onAdvance={importCommitted ? undefined : handleConfirm}
      />
    </div>
  );
}
