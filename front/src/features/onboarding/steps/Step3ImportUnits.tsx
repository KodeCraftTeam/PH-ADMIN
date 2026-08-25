"use client";

import { useRef, useState } from "react";
import { Alert, Badge, Button, Card } from "@/components/ui";
import { StepFooter } from "../components/StepFooter";
import { useWizardDispatch, useWizardState } from "../model/WizardContext";
import { previewUnitsImport } from "../api/onboarding.api";
import { ApiError } from "@/lib/http-client";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function Step3ImportUnits() {
  const { propertyId, importFile, importPreview } = useWizardState();
  const dispatch = useWizardDispatch();
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [genericError, setGenericError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasFile = !!importFile;
  const errors = importPreview?.errors ?? [];

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

    dispatch({ type: "SET_IMPORT_FILE", file });
    setLoading(true);
    try {
      const result = await previewUnitsImport(propertyId, file);
      dispatch({ type: "SET_IMPORT_PREVIEW", result });
    } catch (err) {
      dispatch({ type: "REMOVE_IMPORT_FILE" });
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
    dispatch({ type: "REMOVE_IMPORT_FILE" });
    setGenericError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Importar unidades</h1>
      <p className="mt-1 text-sm text-slate-500">
        Sube el archivo con unidades, personas y propietarios. Usa nuestra plantilla
        para evitar errores de formato.
      </p>

      <div className="mt-3">
        <a
          href="/templates/plantilla-carga-copropiedad.xlsx"
          download
          className="text-sm font-medium text-ph-700 underline-offset-2 hover:underline"
        >
          Descargar plantilla (plantilla-carga-copropiedad.xlsx)
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
                Leyendo y validando el archivo…
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
              <p className="mt-1 text-xs text-slate-400">Solo .xlsx — máx. 5 MB</p>
            </>
          )}
        </div>
      ) : (
        <>
          <Card className="mt-5 flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="text-xl">📄</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">
                  {importFile!.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(importFile!.size / 1024).toFixed(0)} KB
                  {importPreview
                    ? ` · ${importPreview.units.length} unidades detectadas`
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {importPreview && (
                <Badge tone={errors.length === 0 ? "green" : "red"}>
                  {errors.length === 0
                    ? "Vista previa OK"
                    : `${errors.length} error(es)`}
                </Badge>
              )}
              <Button variant="ghost" onClick={removeFile}>
                Quitar archivo
              </Button>
            </div>
          </Card>

          {errors.length > 0 && (
            <div className="mt-4">
              <Alert tone="red" title="El archivo tiene errores">
                Corrígelos en el Excel y vuelve a subirlo — mientras haya errores no se
                importa nada.
              </Alert>
            </div>
          )}

          {errors.length > 0 && (
            <Card className="mt-4 overflow-hidden">
              <div className="max-h-80 overflow-auto divide-y divide-slate-100">
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

          {importPreview && errors.length === 0 && (
            <Card className="mt-4 overflow-hidden">
              <div className="max-h-80 overflow-auto">
                <table className="w-full min-w-160 text-sm">
                  <thead className="sticky top-0">
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-2.5">Unidad</th>
                      <th className="px-4 py-2.5">Agrupador</th>
                      <th className="px-4 py-2.5">Tipo</th>
                      <th className="px-4 py-2.5 text-right">Área (m²)</th>
                      <th className="px-4 py-2.5 text-right">Coef. (%)</th>
                      <th className="px-4 py-2.5">Matrícula</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.units.map((u) => (
                      <tr
                        key={u.identifier}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-4 py-2 font-medium text-slate-800">
                          {u.identifier}
                        </td>
                        <td className="px-4 py-2 text-slate-600">{u.group ?? "—"}</td>
                        <td className="px-4 py-2 text-slate-600">{u.type}</td>
                        <td className="px-4 py-2 text-right text-slate-600">
                          {u.areaM2.toFixed(1)}
                        </td>
                        <td className="px-4 py-2 text-right text-slate-600">
                          {u.coefficient.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-slate-500">
                          {u.matricula ?? "—"}
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
        canAdvance={!!importPreview && errors.length === 0}
        nextLabel="Continuar a validación"
      />
    </div>
  );
}
