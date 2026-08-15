"use client";

import { useState } from "react";
import { Alert, Badge, Button, Card, IconSearch } from "@/components/ui";
import { BALANCE_MOCK } from "@/features/onboarding/model/mocks";

const copFormat = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function AdminBillingView() {
  const [balance, setBalance] = useState(BALANCE_MOCK);
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [noticeAlert, setNoticeAlert] = useState<string | null>(null);

  const filtered = balance.filter((c) => {
    const matchesStatus = filterStatus === "Todos" || c.status === filterStatus;
    const matchesSearch =
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.owner.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  function sendNotice(unitCode: string, owner: string) {
    setNoticeAlert(`Aviso de cobro preventivo enviado exitosamente a ${owner} (${unitCode}).`);
    setTimeout(() => setNoticeAlert(null), 4000);
  }

  return (
    <div className="space-y-6 animate-pop-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
            Cartera & Estado de Cuentas por Unidad
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Saldos acumulados de cuotas de administración y cuotas extraordinarias
          </p>
        </div>
      </div>

      {noticeAlert && (
        <Alert tone="green" title="Notificación Enviada">
          {noticeAlert}
        </Alert>
      )}

      {/* Filter and Search Bar */}
      <Card className="p-4 border border-slate-200 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por unidad (ej: Apto 101) o propietario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg text-xs">
            {["Todos", "Al día", "En mora", "Acuerdo de pago"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  filterStatus === st
                    ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Portfolio Table */}
      <Card className="overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                <th className="px-5 py-3.5">Unidad</th>
                <th className="px-5 py-3.5">Propietario / Residente</th>
                <th className="px-5 py-3.5 text-right">Saldo Acumulado</th>
                <th className="px-5 py-3.5">Estado de Pago</th>
                <th className="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-zinc-100">{c.code}</td>
                  <td className="px-5 py-4 text-slate-700 dark:text-zinc-300 font-medium">{c.owner}</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-900 dark:text-zinc-100">
                    {copFormat.format(c.initialBalance)}
                  </td>
                  <td className="px-5 py-4">
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
                  <td className="px-5 py-4 text-right">
                    {c.status !== "Al día" && (
                      <Button
                        variant="secondary"
                        className="text-xs"
                        onClick={() => sendNotice(c.code, c.owner)}
                      >
                        Enviar Aviso de Cobro
                      </Button>
                    )}
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
