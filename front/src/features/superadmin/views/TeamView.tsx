"use client";

import { Badge, Button, Card, IconUsers } from "@/components/ui";
import { TEAM_MEMBERS_MOCK, TeamMember } from "../model/mocks";

export function TeamView() {
  const members = TEAM_MEMBERS_MOCK;

  const auditLog = [
    { id: "log-1", action: "Reenvío de invitación comercial", target: "administracion@altosdelvirrey.co", user: "Santiago Gómez", time: "Hace 15 min" },
    { id: "log-2", action: "Cambio de Plan (Pro -> Enterprise)", target: "Torres de San Fernando", user: "Santiago Gómez", time: "Hace 2 horas" },
    { id: "log-3", action: "Creación de demo gratuito (14 días)", target: "Residencial Parque 93", user: "Camila Restrepo", time: "Hace 4 horas" },
    { id: "log-4", action: "Aprobación manual de validación Paso 4", target: "Conjunto Cerros de Provenza", user: "Valentina Ríos", time: "Ayer" },
  ];

  return (
    <div className="space-y-6 animate-pop-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Equipo Interno & Log de Auditoría</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Personal con permisos administrativos en la plataforma KodeCraft PH</p>
        </div>
        <Button>+ Invitar Miembro al Equipo</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden border border-slate-200 dark:border-zinc-800">
            <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
                Miembros del Staff ({members.length})
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
              {members.map((m) => (
                <div key={m.id} className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold flex items-center justify-center text-xs">
                      {m.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-zinc-100">{m.name}</p>
                      <p className="truncate text-xs text-slate-400 dark:text-zinc-500">{m.email}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="font-semibold text-slate-800 dark:text-zinc-200">{m.role}</span>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500">{m.propertiesManaged} copropiedades asignadas</p>
                    </div>
                    <Badge tone={m.status === "Activo" ? "green" : "gray"}>{m.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Audit Log Timeline */}
        <div>
          <Card className="p-4 border border-slate-200 dark:border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800 pb-2">
              Historial de Auditoría (Audit Log)
            </h3>

            <div className="space-y-3 pt-1">
              {auditLog.map((log) => (
                <div key={log.id} className="text-xs border-b border-slate-100 dark:border-zinc-800/60 pb-2.5 last:border-0">
                  <p className="font-semibold text-slate-900 dark:text-zinc-100">{log.action}</p>
                  <p className="text-slate-500 dark:text-zinc-400 mt-0.5">{log.target}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                    <span>{log.user}</span>
                    <span>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
