"use client";

import { Card, IconBuilding, IconChart, IconCheck, IconDollar, IconUsers } from "@/components/ui";

const copFormat = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

interface Props {
  totalBalance: number;
  overdue: number;
  paymentPlans: number;
  onQuickAction: (action: string) => void;
}

export function AdminOverviewView({
  totalBalance,
  overdue,
  paymentPlans,
  onQuickAction,
}: Props) {
  const QUICK_ACTIONS = [
    { id: "billing", title: "Generar facturación", detail: "Cuotas de administración de agosto 2026" },
    { id: "broadcast", title: "Enviar comunicado", detail: "Correo o cartelera digital a residentes" },
    { id: "pqrs", title: "Atender PQRS", detail: "3 solicitudes pendientes por responder" },
    { id: "assembly", title: "Asambleas & Actas", detail: "Próxima asamblea general ordinaria" },
  ];

  return (
    <div className="space-y-6 animate-pop-in">
      {/* High-Impact Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
              Cartera Total Pendiente
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <IconDollar className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
            {copFormat.format(totalBalance)}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">7 unidades con saldo acumulado</p>
        </Card>

        <Card className="p-5 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
              Recaudo del Mes (Julio)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <IconCheck className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            82%
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">Meta comercial: <strong>90% de recaudo</strong></p>
        </Card>

        <Card className="p-5 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
              Unidades en Mora
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              !
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">
            {overdue}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">+ {paymentPlans} con acuerdo de pago activo</p>
        </Card>

        <Card className="p-5 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
              Copropiedad
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <IconBuilding className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
            18
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">16 aptos • 2 locales comerciales</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 mb-3">
          Acciones Rápidas de Operación
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((a) => (
            <Card
              key={a.id}
              onClick={() => onQuickAction(a.id)}
              className="cursor-pointer p-4 border border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 transition-all hover:shadow-xs"
            >
              <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">{a.title}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{a.detail}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
