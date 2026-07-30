"use client";

import { useState } from "react";
import { Badge, Button, Card } from "@/components/ui";
import { ADMIN_PQRS_MOCK, AdminPqrs } from "../model/adminMocks";

export function AdminPqrsView() {
  const [pqrsList, setPqrsList] = useState<AdminPqrs[]>(ADMIN_PQRS_MOCK);
  const [filterStatus, setFilterStatus] = useState<string>("Todos");

  const filtered = pqrsList.filter(
    (p) => filterStatus === "Todos" || p.status === filterStatus
  );

  function resolvePqrs(id: string) {
    setPqrsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Resuelto" as const } : p))
    );
  }

  return (
    <div className="space-y-6 animate-pop-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
            PQRS & Atenciones a Propietarios
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Gestión de solicitudes, reclamos de áreas comunes y reportes de convivencia
          </p>
        </div>
      </div>

      {/* Filter Pills */}
      <Card className="p-3 border border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-xs">
          {["Todos", "Pendiente", "En proceso", "Resuelto"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                filterStatus === st
                  ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
              }`}
            >
              {st === "Todos" ? "Todas las PQRS" : st}
            </button>
          ))}
        </div>
      </Card>

      {/* PQRS List */}
      <Card className="overflow-hidden border border-slate-200 dark:border-zinc-800">
        <div className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
          {filtered.map((p) => (
            <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-zinc-500">{p.id}</span>
                  <Badge tone={p.priority === "Alta" ? "red" : p.priority === "Media" ? "amber" : "gray"}>
                    Prioridad {p.priority}
                  </Badge>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    {p.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">{p.subject}</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  {p.unit} • Propietario: <strong>{p.residentName}</strong> • {p.date}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    p.status === "Pendiente"
                      ? "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                      : p.status === "En proceso"
                      ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                      : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  }`}
                >
                  {p.status}
                </span>

                {p.status !== "Resuelto" && (
                  <Button variant="secondary" className="text-xs" onClick={() => resolvePqrs(p.id)}>
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
