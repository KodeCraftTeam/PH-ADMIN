"use client";

import Link from "next/link";
import { Badge, Card, IconBuilding, IconCheck } from "@/components/ui";
import { BALANCE_MOCK } from "@/features/onboarding/model/mocks";

const copFormat = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const QUICK_ACTIONS = [
  {
    title: "Generar facturación",
    detail: "Cuotas de administración de agosto 2026",
  },
  { title: "Enviar comunicado", detail: "Correo o cartelera digital a residentes" },
  { title: "PQRS", detail: "3 solicitudes sin responder" },
  { title: "Asambleas y actas", detail: "Próxima asamblea sin programar" },
];

export function AdminDashboard() {
  const balance = BALANCE_MOCK;
  const totalBalance = balance.reduce((a, c) => a + c.initialBalance, 0);
  const overdue = balance.filter((c) => c.status === "En mora").length;
  const paymentPlans = balance.filter((c) => c.status === "Acuerdo de pago").length;

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ph-800 text-white">
            <IconBuilding />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Conjunto Residencial Altos del Virrey
            </p>
            <p className="text-xs text-slate-400">
              NIT 901.456.789-2 · Bogotá D.C. · 18 unidades
            </p>
          </div>
          <Badge tone="green">
            <IconCheck className="h-3 w-3" /> Activo
          </Badge>
          <nav className="ml-auto flex items-center gap-4 text-xs">
            <span className="font-medium text-slate-900">Panel</span>
            <Link href="/onboarding" className="text-slate-400 hover:text-slate-700">
              Onboarding (demo)
            </Link>
            <Link href="/superadmin" className="text-slate-400 hover:text-slate-700">
              Super admin (demo)
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-xl font-semibold text-slate-900">
          Hola, Diana Carolina
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Resumen del conjunto con corte al 30 de junio de 2026.
        </p>

        <div className="mt-6 grid grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Cartera total
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {copFormat.format(totalBalance)}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">7 unidades con saldo</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Recaudo del mes
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-600">82%</p>
            <p className="mt-0.5 text-xs text-slate-400">meta: 90%</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              En mora
            </p>
            <p className="mt-1 text-2xl font-semibold text-red-600">{overdue}</p>
            <p className="mt-0.5 text-xs text-slate-400">
              + {paymentPlans} con acuerdo de pago
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Unidades
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">18</p>
            <p className="mt-0.5 text-xs text-slate-400">16 apartamentos · 2 locales</p>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((a) => (
            <Card
              key={a.title}
              className="cursor-pointer p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <p className="text-sm font-semibold text-slate-800">{a.title}</p>
              <p className="mt-1 text-xs text-slate-500">{a.detail}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Cartera por unidad
          </h2>
          <span className="text-xs text-slate-400">
            Datos cargados en el onboarding · corte 30 jun 2026
          </span>
        </div>

        <Card className="mt-3 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Unidad</th>
                <th className="px-4 py-3">Propietario</th>
                <th className="px-4 py-3 text-right">Saldo</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {balance.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-slate-800">
                    {c.code}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{c.owner}</td>
                  <td className="px-4 py-2.5 text-right text-slate-700">
                    {copFormat.format(c.initialBalance)}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge
                      tone={
                        c.status === "Al día"
                          ? "green"
                          : c.status === "En mora"
                            ? "red"
                            : "amber"
                      }
                    >
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
}
