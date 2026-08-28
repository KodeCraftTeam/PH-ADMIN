"use client";

import { useRef, useState } from "react";
import { Alert, Badge, Button, Card } from "@/components/ui";
import { StepFooter } from "../components/StepFooter";
import { useWizardDispatch, useWizardState } from "../model/WizardContext";
import {
  commitBalanceImport,
  getOnboardingStatus,
  previewBalanceImport,
} from "../api/onboarding.api";
import { ApiError } from "@/lib/http-client";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const copFormat = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const STATUS_LABEL: Record<string, string> = {
  AL_DIA: "Al día",
  EN_MORA: "En mora",
  ACUERDO_DE_PAGO: "Acuerdo de pago",
};

export function Step5InitialBalance() {
  const { propertyId, balanceFile, balancePreview, balanceCommitted } =
    useWizardState();
  const dispatch = useWizardDispatch();
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [genericError, setGenericError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasFile = !!balanceFile;
  const errors = balancePreview?.errors ?? [];
  const warnings = balancePreview?.warnings ?? [];
  const hasCleanPreview = !!balancePreview && errors.length === 0;
  const totalBalance = (balancePreview?.balances ?? []).reduce(
    (acc, b) => acc + b.balanceCOP,
    0
  );

  async function handleFile(file: File) {
    setGenericError(null);

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setGenericError("Solo se admite formato .xlsx.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setGenericError("El archivo supera el tamaño máximo de 5 MB.");
      return;
    }
    if (!propertyId) {
      setGenericError(
        "No se encontró la copropiedad. Vuelve al paso 1 y guarda los datos del conjunto."
      );
      return;
    }

    dispatch({ type: "SET_BALANCE_FILE", file });
    setLoading(true);
    try {
      const result = await previewBalanceImport(propertyId, file);
      dispatch({ type: "SET_BALANCE_PREVIEW", result });
    } catch (err) {
      dispatch({ type: "REMOVE_BALANCE_FILE" });
      setGenericError(
        err instanceof ApiError ? err.message : "No se pudo leer el archivo."
      );
    } finally {
      setLoading(false);
    }
  }

  function openFilePicker() {
    if (loading || hasFile) return;
    inputRef.current?.click();
  }

  function removeFile() {
    dispatch({ type: "REMOVE_BALANCE_FILE" });
    setGenericError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleConfirm(): Promise<boolean> {
    if (!propertyId || !balanceFile) return false;

    try {
      const result = await commitBalanceImport(propertyId, balanceFile);
      dispatch({ type: "SET_BALANCE_COMMITTED", result });
      try {
        const status = await getOnboardingStatus(propertyId);
        dispatch({ type: "SET_STATUS", status });
      } catch {
        // el estado se puede refrescar más adelante; no bloquea el flujo
      }
      return true;
    } catch (err) {
      setGenericError(
        err instanceof ApiError ? err.message : "No se pudo confirmar la importación."
      );
      return false;
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">Cartera inicial</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
        Carga los saldos con los que cada unidad inicia en la plataforma, con corte a
        la fecha que definas. Este paso es opcional para activar el conjunto — puedes
        completarlo después.
      </p>

      <div className="mt-4">
        <Alert tone="amber" title="⚠ Este paso requiere revisión cuidadosa">
          Los saldos que cargues aquí afectan cobros reales a los residentes desde el
          primer día. Verifica cada valor contra tu contabilidad antes de continuar.
        </Alert>
      </div>

      <div className="mt-3">
        <a
          href="/templates/plantilla-saldos-iniciales.xlsx"
          download
          className="text-sm font-medium text-ph-700 dark:text-zinc-200 underline-offset-2 hover:underline"
        >
          Descargar plantilla (plantilla-saldos-iniciales.xlsx)
        </a>
      </div>

      {genericError && (
        <div className="mt-4">
          <Alert tone="red" title="No se pudo procesar el archivo">
            {genericError}
          </Alert>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {!hasFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          onClick={openFilePicker}
          className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 sm:px-6 py-10 sm:py-14 text-center transition-colors ${
            dragging
              ? "border-ph-500 dark:border-ph-400 bg-ph-50 dark:bg-zinc-800/60"
              : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-ph-400 dark:hover:border-ph-500 hover:bg-ph-50/40 dark:hover:bg-zinc-800/40"
          }`}
        >
          {loading ? (
            <>
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-ph-200 dark:border-zinc-700 border-t-ph-600 dark:border-t-ph-300" />
              <p className="mt-4 text-sm font-medium text-slate-700 dark:text-zinc-300">
                Leyendo y validando el archivo…
              </p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ph-100 dark:bg-zinc-800 text-2xl">
                💰
              </div>
              <p className="mt-4 text-sm font-medium text-slate-700 dark:text-zinc-300">
                Arrastra tu archivo aquí, o{" "}
                <span className="text-ph-700 dark:text-zinc-200">selecciona un archivo</span>
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">Solo .xlsx — máx. 5 MB</p>
            </>
          )}
        </div>
      ) : (
        <>
          <Card className="mt-5 flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="text-xl">💰</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-zinc-200">
                  {balanceFile!.name}
                </p>
                <p className="text-xs text-slate-400 dark:text-zinc-500">
                  {(balanceFile!.size / 1024).toFixed(0)} KB
                  {balancePreview
                    ? ` · ${balancePreview.balances.length} saldos en el archivo`
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {balancePreview && (
                <Badge tone={errors.length === 0 ? "green" : "red"}>
                  {errors.length === 0
                    ? "Vista previa OK"
                    : `${errors.length} error(es)`}
                </Badge>
              )}
              <Button variant="ghost" onClick={removeFile} disabled={balanceCommitted}>
                Quitar archivo
              </Button>
            </div>
          </Card>

          {balanceCommitted && (
            <div className="mt-4">
              <Alert tone="green" title="Cartera inicial importada">
                Se cargaron {balancePreview?.totalUpserted ?? 0} saldos. Total inicial:{" "}
                {copFormat.format(totalBalance)}.
              </Alert>
            </div>
          )}

          {errors.length > 0 && (
            <div className="mt-4">
              <Alert tone="red" title="El archivo tiene errores">
                Corrígelos en el Excel y vuelve a subirlo — mientras haya errores no se
                importa nada.
              </Alert>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="mt-4">
              <Alert tone="amber" title="Revisa estas filas antes de continuar">
                No bloquean la importación, pero pueden ser errores de digitación.
              </Alert>
            </div>
          )}

          {errors.length > 0 && (
            <Card className="mt-4 overflow-hidden">
              <div className="max-h-80 overflow-auto divide-y divide-slate-100 dark:divide-zinc-800">
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

          {warnings.length > 0 && (
            <Card className="mt-4 overflow-hidden">
              <div className="max-h-80 overflow-auto divide-y divide-slate-100 dark:divide-zinc-800">
                {warnings.map((w, i) => (
                  <div key={i} className="px-4 py-2.5 text-sm">
                    <span className="font-medium text-slate-700 dark:text-zinc-300">
                      {w.sheet}
                      {w.row > 0 ? ` · fila ${w.row}` : ""}
                    </span>
                    <span className="ml-2 text-amber-600 dark:text-amber-400">{w.message}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {balancePreview && errors.length === 0 && (
            <Card className="mt-4 overflow-hidden">
              <div className="max-h-80 overflow-auto">
                <table className="w-full min-w-140 text-sm">
                  <thead className="sticky top-0">
                    <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-400">
                      <th className="px-4 py-2.5">Unidad</th>
                      <th className="px-4 py-2.5 text-right">Saldo inicial (COP)</th>
                      <th className="px-4 py-2.5">Fecha de corte</th>
                      <th className="px-4 py-2.5">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {balancePreview.balances.map((b) => (
                      <tr key={b.identifier} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-0">
                        <td className="px-4 py-2 font-medium text-slate-800 dark:text-zinc-200">
                          {b.identifier}
                        </td>
                        <td className="px-4 py-2 text-right text-slate-600 dark:text-zinc-400">
                          {copFormat.format(b.balanceCOP)}
                        </td>
                        <td className="px-4 py-2 text-slate-600 dark:text-zinc-400">{b.cutoffDate}</td>
                        <td className="px-4 py-2">
                          <Badge
                            tone={
                              b.status === "AL_DIA"
                                ? "green"
                                : b.status === "EN_MORA"
                                  ? "red"
                                  : "amber"
                            }
                          >
                            {STATUS_LABEL[b.status] ?? b.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      <StepFooter
        canAdvance={balanceCommitted || hasCleanPreview || !hasFile}
        nextLabel={balanceCommitted ? "Continuar a revisión" : hasFile ? "Confirmar e importar" : "Continuar sin cargar saldos"}
        onAdvance={hasFile && !balanceCommitted ? handleConfirm : undefined}
      />
    </div>
  );
}
