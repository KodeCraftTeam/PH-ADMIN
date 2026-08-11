"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge, Button, Card, IconBuilding, IconCheck, IconSearch, IconUsers, IconDollar, IconChevronRight } from "@/components/ui";
import { ADMIN_MANAGED_PROPERTIES, type ManagedProperty } from "../model/adminPropertiesMock";

interface Props {
  onSelectProperty: (property: ManagedProperty) => void;
  onNewPropertyClick?: () => void;
}

export function AdminPropertiesHubView({ onSelectProperty, onNewPropertyClick }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const filteredProperties = useMemo(() => {
    return ADMIN_MANAGED_PROPERTIES.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        p.nit.includes(search);
      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVO" && p.status === "Activo") ||
        (statusFilter === "ONBOARDING" && p.status === "En Onboarding") ||
        (statusFilter === "MORA" && p.overdueUnits > 0);
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalUnits = useMemo(
    () => ADMIN_MANAGED_PROPERTIES.reduce((acc, p) => acc + p.unitsCount, 0),
    []
  );

  const totalPendingBalance = useMemo(
    () => ADMIN_MANAGED_PROPERTIES.reduce((acc, p) => acc + p.pendingBalance, 0),
    []
  );

  const totalPqrs = useMemo(
    () => ADMIN_MANAGED_PROPERTIES.reduce((acc, p) => acc + p.pendingPqrs, 0),
    []
  );

  function formatCurrency(val: number) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  }

  return (
    <div className="space-y-6 animate-pop-in">
      {/* Top Banner / Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900 p-6 md:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-48 w-48 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold backdrop-blur-md mb-3 border border-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Portal Multi-Copropiedad PH
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Mis Proyectos & Copropiedades
            </h1>
            <p className="mt-1.5 text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Selecciona cualquiera de tus copropiedades para ingresar a gestionar su cartera, residentes, solicitudes PQRS, citofonía y comunicados.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/onboarding">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 shadow-lg shadow-emerald-500/20 border-0 cursor-pointer">
                + Nueva Copropiedad
              </Button>
            </Link>
          </div>
        </div>

        {/* Global Summary Metric Strip */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Proyectos Asignados
            </p>
            <p className="mt-1 text-xl font-bold text-white">
              {ADMIN_MANAGED_PROPERTIES.length}{" "}
              <span className="text-xs font-normal text-slate-400">copropiedades</span>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Unidades
            </p>
            <p className="mt-1 text-xl font-bold text-white">
              {totalUnits}{" "}
              <span className="text-xs font-normal text-slate-400">inmuebles</span>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Cartera Pendiente Global
            </p>
            <p className="mt-1 text-xl font-bold text-emerald-400">
              {formatCurrency(totalPendingBalance)}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              PQRS Activas
            </p>
            <p className="mt-1 text-xl font-bold text-amber-400">
              {totalPqrs}{" "}
              <span className="text-xs font-normal text-slate-400">pendientes</span>
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por conjunto, ciudad o NIT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-zinc-100/10"
          />
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-zinc-800/80 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              Todas ({ADMIN_MANAGED_PROPERTIES.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("ACTIVO")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                statusFilter === "ACTIVO"
                  ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              Activas
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("ONBOARDING")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                statusFilter === "ONBOARDING"
                  ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              En Onboarding
            </button>
          </div>

          <div className="flex items-center gap-1 border-l border-slate-200 dark:border-zinc-800 pl-3">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
              }`}
              title="Vista en Tarjetas"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
              }`}
              title="Vista en Lista"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M3.75 4.5h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Mode Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProperties.map((prop) => (
            <Card
              key={prop.id}
              className="group relative overflow-hidden p-6 hover:shadow-xl transition-all duration-300 border-slate-200/90 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 flex flex-col justify-between"
            >
              {/* Top Card Bar */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md group-hover:scale-105 transition-transform shrink-0">
                      <IconBuilding className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {prop.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                        NIT {prop.nit} · {prop.city}
                      </p>
                    </div>
                  </div>

                  <Badge
                    tone={
                      prop.status === "Activo"
                        ? "green"
                        : prop.status === "En Onboarding"
                        ? "amber"
                        : "red"
                    }
                  >
                    {prop.status === "Activo" && <IconCheck className="h-3 w-3" />}
                    {prop.status}
                  </Badge>
                </div>

                {/* Info Pills */}
                <div className="flex items-center gap-2 py-2 text-[11px] text-slate-500 dark:text-zinc-400 border-y border-slate-100 dark:border-zinc-800/80 my-3">
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">
                    Tipo: {prop.type}
                  </span>
                  <span>•</span>
                  <span>{prop.unitsCount} unidades</span>
                  <span>•</span>
                  <span className="font-medium text-slate-600 dark:text-zinc-300">
                    Plan {prop.plan}
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-zinc-400 font-medium">Recaudo Mes</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {prop.recaudoPercentage}%
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-zinc-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${prop.recaudoPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                    <span className="block text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                      Cartera Pendiente
                    </span>
                    <span className="mt-1 block text-sm font-bold text-slate-900 dark:text-zinc-100">
                      {formatCurrency(prop.pendingBalance)}
                    </span>
                  </div>
                </div>

                {/* Sub-status indicators */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${prop.overdueUnits > 0 ? "bg-amber-500" : "bg-emerald-500"}`} />
                    <span>{prop.overdueUnits} unidades en mora</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="font-medium text-slate-700 dark:text-zinc-300">
                      {prop.pendingPqrs} PQRS
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                  Resp. {prop.lastBackupDate}
                </span>

                <Button
                  onClick={() => onSelectProperty(prop)}
                  className="bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-bold px-4 py-2 text-xs rounded-xl shadow-md cursor-pointer group-hover:translate-x-0.5 transition-all"
                >
                  Ingresar a Administrar
                  <IconChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Table Mode Display */
        <div className="rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-zinc-800/80 text-slate-500 dark:text-zinc-400 font-semibold border-b border-slate-200 dark:border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4">Copropiedad</th>
                  <th className="py-3.5 px-4">Ciudad / NIT</th>
                  <th className="py-3.5 px-4">Unidades</th>
                  <th className="py-3.5 px-4">% Recaudo</th>
                  <th className="py-3.5 px-4">Cartera Pendiente</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-slate-800 dark:text-zinc-200">
                {filteredProperties.map((prop) => (
                  <tr
                    key={prop.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-zinc-100">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs shrink-0">
                          <IconBuilding className="h-3.5 w-3.5" />
                        </span>
                        <span>{prop.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400">
                      {prop.city} · <span className="text-slate-400">{prop.nit}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{prop.unitsCount} uds</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {prop.recaudoPercentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      {formatCurrency(prop.pendingBalance)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        tone={
                          prop.status === "Activo"
                            ? "green"
                            : prop.status === "En Onboarding"
                            ? "amber"
                            : "red"
                        }
                      >
                        {prop.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        onClick={() => onSelectProperty(prop)}
                        className="py-1.5 px-3 text-xs bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 cursor-pointer"
                      >
                        Administrar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
