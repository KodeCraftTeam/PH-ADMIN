"use client";

import { useState } from "react";
import { Alert, Badge, Button, Card } from "@/components/ui";
import { TICKETS_MOCK, SupportTicket } from "../model/mocks";

export function SupportTicketsView() {
  const [tickets, setTickets] = useState<SupportTicket[]>(TICKETS_MOCK);
  const [filterStatus, setFilterStatus] = useState<string>("Todos");

  const filteredTickets = tickets.filter(
    (t) => filterStatus === "Todos" || t.status === filterStatus
  );

  function resolveTicket(id: string) {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Resuelto" as const } : t))
    );
  }

  const openCount = tickets.filter((t) => t.status !== "Resuelto").length;

  return (
    <div className="space-y-6 animate-pop-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
            Centro de Soporte & PQRS de Plataforma
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Atención de requerimientos técnicos y asistencias en el wizard de onboarding
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={openCount > 0 ? "red" : "green"}>
            {openCount} tickets pendientes
          </Badge>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card className="p-3 border border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-xs">
          {["Todos", "Abierto", "En revisión", "Resuelto"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                filterStatus === st
                  ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
              }`}
            >
              {st === "Todos" ? "Todos los Tickets" : st}
            </button>
          ))}
        </div>
      </Card>

      {/* Tickets List */}
      <Card className="overflow-hidden border border-slate-200 dark:border-zinc-800">
        <div className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
          {filteredTickets.map((t) => (
            <div key={t.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-zinc-500">{t.id}</span>
                  <Badge tone={t.priority === "Alta" ? "red" : t.priority === "Media" ? "amber" : "gray"}>
                    Prioridad {t.priority}
                  </Badge>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    {t.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">{t.subject}</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  {t.propertyName} • Admin: <strong>{t.adminName}</strong> • {t.createdAt}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    t.status === "Abierto"
                      ? "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                      : t.status === "En revisión"
                      ? "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800"
                      : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  }`}
                >
                  {t.status}
                </span>

                {t.status !== "Resuelto" && (
                  <Button variant="secondary" className="text-xs" onClick={() => resolveTicket(t.id)}>
                    Marcar Resuelto
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
