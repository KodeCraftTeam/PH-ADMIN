"use client";

import { Alert, Badge, Button, Card, IconCreditCard, IconDollar } from "@/components/ui";
import { PlatformProperty } from "../model/mocks";
import { formatCOP } from "../components/charts/RevenueTrendChart";

interface Props {
  properties: PlatformProperty[];
  onSelectProperty: (prop: PlatformProperty) => void;
}

export function SubscriptionsView({ properties, onSelectProperty }: Props) {
  const overdueCount = properties.filter((p) => p.billingStatus === "Moroso").length;
  const activePaid = properties.filter((p) => p.billingStatus === "Al día");
  const trials = properties.filter((p) => p.billingStatus === "Prueba (14 días)");

  return (
    <div className="space-y-6 animate-pop-in">
      {/* Subscriptions Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
              Suscripciones Al Día
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              ✓
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-zinc-100">
            {activePaid.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
            Generando <strong className="text-slate-800 dark:text-zinc-200">{formatCOP(activePaid.reduce((a, c) => a + c.mrr, 0))} COP</strong> / mes
          </p>
        </Card>

        <Card className="p-5 border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
              Demos & Prueba Gratuita
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              14d
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-zinc-100">
            {trials.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
            Conversión estimada Q3: <strong className="text-slate-800 dark:text-zinc-200">85%</strong>
          </p>
        </Card>

        <Card className="p-5 border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
              Alertas de Morosidad
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              !
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-zinc-100">
            {overdueCount}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
            Requiere gestión de cobro cartera
          </p>
        </Card>
      </div>

      {overdueCount > 0 && (
        <Alert tone="amber" title="Atención comercial">
          Se han detectado {overdueCount} copropiedades con mensualidades vencidas en mora. Se recomienda enviar recordatorio de pago vía PSE/Wompi.
        </Alert>
      )}

      {/* Subscriptions Table */}
      <Card className="overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Facturación & Planes Recurrentes</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Monitoreo de vigencia de contratos y pasarela de cobros automatizados</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                <th className="px-5 py-3.5">Copropiedad</th>
                <th className="px-5 py-3.5">Plan</th>
                <th className="px-5 py-3.5">MRR Acordado</th>
                <th className="px-5 py-3.5">Estado de Pago</th>
                <th className="px-5 py-3.5">Método Registrado</th>
                <th className="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900 dark:text-zinc-100">{p.name}</p>
                    <p className="text-xs text-slate-400 dark:text-zinc-500">{p.city}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200">
                      {p.plan}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-zinc-100">
                    {formatCOP(p.mrr)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        p.billingStatus === "Al día"
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : p.billingStatus === "Moroso"
                          ? "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                          : "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      {p.billingStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-slate-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <IconCreditCard className="h-3.5 w-3.5" />
                      <span>{p.mrr > 0 ? "Débito Automático PSE" : "Suscripción Demo"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button variant="secondary" className="text-xs" onClick={() => onSelectProperty(p)}>
                      Gestionar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
