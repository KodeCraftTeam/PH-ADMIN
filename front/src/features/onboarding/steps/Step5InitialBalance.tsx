"use client";

import { Alert, Badge, Button, Card, Input, Select } from "@/components/ui";
import { StepFooter } from "../components/StepFooter";
import { useWizardDispatch, useWizardState } from "../model/WizardContext";
import type { BalanceStatus } from "../model/types";

const STATUSES: BalanceStatus[] = ["Al día", "En mora", "Acuerdo de pago"];

const copFormat = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function Step5InitialBalance() {
  const { balance, balanceLoaded } = useWizardState();
  const dispatch = useWizardDispatch();

  const withDebt = balance.filter((c) => c.status !== "Al día");
  const totalBalance = balance.reduce((acc, c) => acc + c.initialBalance, 0);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Cartera inicial</h1>
      <p className="mt-1 text-sm text-slate-500">
        Carga los saldos con los que cada unidad inicia en la plataforma, con corte a
        la fecha que definas.
      </p>

      <div className="mt-4">
        <Alert tone="amber" title="⚠ Este paso requiere revisión cuidadosa">
          Los saldos que cargues aquí afectan cobros reales a los residentes desde el
          primer día. Verifica cada valor contra tu contabilidad antes de continuar.
          Si tienes dudas, puedes avanzar y ajustar la cartera con soporte antes de
          emitir la primera facturación.
        </Alert>
      </div>

      {!balanceLoaded ? (
        <Card className="mt-5 flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ph-100 text-2xl">
            💰
          </div>
          <p className="mt-4 text-sm font-medium text-slate-700">
            Importa los saldos iniciales por unidad
          </p>
          <p className="mt-1 max-w-md text-xs text-slate-400">
            Puedes subir el archivo de cartera o generarlo automáticamente a partir de
            las unidades ya importadas y editar los valores en pantalla.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Button onClick={() => dispatch({ type: "LOAD_BALANCE" })}>
              Generar desde unidades importadas
            </Button>
            <Button
              variant="secondary"
              onClick={() => dispatch({ type: "LOAD_BALANCE" })}
            >
              Subir archivo de cartera
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Unidades con saldo
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {withDebt.length}
                <span className="text-base font-normal text-slate-400">
                  {" "}
                  de {balance.length}
                </span>
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Cartera total inicial
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {copFormat.format(totalBalance)}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Fecha de corte
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">30 jun 2026</p>
            </Card>
          </div>

          <Card className="mt-4 overflow-hidden">
            <div className="max-h-96 overflow-auto">
              <table className="w-full min-w-180 text-sm">
                <thead className="sticky top-0">
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2.5">Unidad</th>
                    <th className="px-4 py-2.5">Propietario</th>
                    <th className="w-44 px-4 py-2.5">Saldo inicial (COP)</th>
                    <th className="w-40 px-4 py-2.5">Fecha de corte</th>
                    <th className="w-44 px-4 py-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {balance.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2 font-medium text-slate-800">
                        {c.code}
                      </td>
                      <td className="px-4 py-2 text-slate-600">{c.owner}</td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          min={0}
                          value={c.initialBalance}
                          onChange={(e) =>
                            dispatch({
                              type: "EDIT_BALANCE_ROW",
                              id: c.id,
                              field: "initialBalance",
                              value: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="date"
                          value={c.cutoffDate}
                          onChange={(e) =>
                            dispatch({
                              type: "EDIT_BALANCE_ROW",
                              id: c.id,
                              field: "cutoffDate",
                              value: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Select
                            value={c.status}
                            onChange={(e) =>
                              dispatch({
                                type: "EDIT_BALANCE_ROW",
                                id: c.id,
                                field: "status",
                                value: e.target.value,
                              })
                            }
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </Select>
                          <Badge
                            tone={
                              c.status === "Al día"
                                ? "green"
                                : c.status === "En mora"
                                  ? "red"
                                  : "amber"
                            }
                          >
                            ●
                          </Badge>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <StepFooter canAdvance={balanceLoaded} />
    </div>
  );
}
