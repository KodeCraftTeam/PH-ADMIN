"use client";

import { Alert, Badge, Button, Card, IconCheck, IconX } from "@/components/ui";
import { sumCoefficients } from "../model/mocks";
import { StepFooter } from "../components/StepFooter";
import { useWizardDispatch, useWizardState } from "../model/WizardContext";

export function Step4Validation() {
  const { units, validationFixed } = useWizardState();
  const dispatch = useWizardDispatch();

  const valid = units.filter((u) => u.status === "ok").length;
  const total = units.length;
  const allOk = total > 0 && valid === total;
  const sum = sumCoefficients(units);
  const sumOk = sum === 100;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Validación automática</h1>
      <p className="mt-1 text-sm text-slate-500">
        Revisamos cada fila del archivo: coeficientes, duplicados, emails y datos
        obligatorios. Solo puedes continuar cuando todo esté en verde.
      </p>

      {/* Summary */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Unidades válidas
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {valid}{" "}
            <span className="text-base font-normal text-slate-400">de {total}</span>
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
            {sum.toFixed(2)}%
          </p>
          <p className="text-xs text-slate-400">debe ser 100.00%</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Estado general
          </p>
          <div className="mt-2">
            {allOk && sumOk ? (
              <Badge tone="green">
                <IconCheck className="h-3 w-3" /> Todo listo
              </Badge>
            ) : (
              <Badge tone="red">
                <IconX className="h-3 w-3" /> {total - valid} errores por corregir
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {!allOk && (
        <div className="mt-4">
          <Alert tone="blue" title="¿No sabes cómo corregirlo?">
            La mayoría de errores se resuelven ajustando el archivo y volviéndolo a
            subir. Si el problema persiste, nuestro equipo de soporte puede revisarlo
            contigo — escríbenos desde el chat de ayuda.
          </Alert>
        </div>
      )}

      {allOk && validationFixed && (
        <div className="mt-4">
          <Alert tone="green" title="Errores corregidos">
            Se aplicaron las correcciones sugeridas y las {total} unidades pasaron la
            validación. La suma de coeficientes ahora es exactamente 100.00%.
          </Alert>
        </div>
      )}

      <Card className="mt-4 overflow-hidden">
        <div className="max-h-96 overflow-auto">
          <table className="w-full min-w-160 text-sm">
            <thead className="sticky top-0">
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="w-24 px-4 py-2.5">Estado</th>
                <th className="px-4 py-2.5">Unidad</th>
                <th className="px-4 py-2.5 text-right">Coef. (%)</th>
                <th className="px-4 py-2.5">Propietario</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr
                  key={u.id}
                  className={`border-b border-slate-100 last:border-0 ${
                    u.status === "error" ? "bg-red-50/60" : ""
                  }`}
                >
                  <td className="px-4 py-2">
                    {u.status === "ok" ? (
                      <Badge tone="green">
                        <IconCheck className="h-3 w-3" /> OK
                      </Badge>
                    ) : (
                      <Badge tone="red">
                        <IconX className="h-3 w-3" /> Error
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium text-slate-800">{u.code}</td>
                  <td className="px-4 py-2 text-right text-slate-600">
                    {u.coefficient.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-slate-600">{u.owner}</td>
                  <td className="px-4 py-2 text-slate-500">{u.email}</td>
                  <td className="px-4 py-2 text-xs text-red-600">
                    {u.errorDetail ?? ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {!allOk && (
        <div className="mt-5 flex justify-center">
          <Button onClick={() => dispatch({ type: "FIX_ERRORS" })}>
            Corregir y reintentar
          </Button>
        </div>
      )}

      <StepFooter canAdvance={allOk && sumOk} nextLabel="Continuar" />
    </div>
  );
}
