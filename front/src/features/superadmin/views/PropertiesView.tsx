"use client";

import { useState, useMemo } from "react";
import { Badge, Card, IconCheck, IconEye, IconSearch } from "@/components/ui";
import { PlatformProperty, PlatformPropertyStatus } from "../model/mocks";
import { formatCOP } from "../components/charts/RevenueTrendChart";

function StatusBadge({ status }: { status: PlatformPropertyStatus }) {
  if (status === "Activo") {
    return (
      <Badge tone="green">
        <IconCheck className="h-3 w-3" /> Activo
      </Badge>
    );
  }
  if (status === "En onboarding") return <Badge tone="blue">En onboarding</Badge>;
  if (status === "Demo (Prueba)") return <Badge tone="amber">Demo (14d)</Badge>;
  return <Badge tone="gray">Invitación enviada</Badge>;
}

function BillingBadge({ status }: { status: PlatformProperty["billingStatus"] }) {
  if (status === "Al día") return <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">Al día</span>;
  if (status === "Moroso") return <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800">Moroso</span>;
  if (status === "Prueba (14 días)") return <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">Demo</span>;
  return <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-zinc-700">Pendiente</span>;
}

interface Props {
  properties: PlatformProperty[];
  onSelectProperty: (prop: PlatformProperty) => void;
}

export function PropertiesView({ properties, onSelectProperty }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("Todos");
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>("Todos");

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatusFilter === "Todos" || p.status === selectedStatusFilter;

      const matchesPlan =
        selectedPlanFilter === "Todos" || p.plan === selectedPlanFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [properties, searchTerm, selectedStatusFilter, selectedPlanFilter]);

  return (
    <div className="space-y-4 animate-pop-in">
      {/* Search and Filters Bar */}
      <Card className="p-4 border border-slate-200 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por conjunto, administrador, correo o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-10 pr-4 py-2 text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-slate-900 dark:focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg text-xs">
              {["Todos", "Activo", "En onboarding", "Demo (Prueba)", "Invitación enviada"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    selectedStatusFilter === status
                      ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs"
                      : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {status === "Todos" ? "Todos los estados" : status}
                </button>
              ))}
            </div>

            <select
              value={selectedPlanFilter}
              onChange={(e) => setSelectedPlanFilter(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-slate-700 dark:text-zinc-200 focus:border-slate-900 dark:focus:border-zinc-400 focus:outline-none font-medium"
            >
              <option value="Todos">Todos los planes</option>
              <option value="Starter">Starter</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Demo">Demo</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Main Interactive Table */}
      <Card className="overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                <th className="px-5 py-3.5">Copropiedad</th>
                <th className="px-5 py-3.5">Plan Comercial</th>
                <th className="px-5 py-3.5">MRR (COP)</th>
                <th className="px-5 py-3.5">Administrador Directo</th>
                <th className="px-5 py-3.5 text-center">Unidades</th>
                <th className="px-5 py-3.5">Estado Operativo</th>
                <th className="px-5 py-3.5">Facturación</th>
                <th className="px-5 py-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
              {filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400 dark:text-zinc-500 text-sm">
                    No se encontraron copropiedades que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredProperties.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                    onClick={() => onSelectProperty(p)}
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900 dark:text-zinc-100">{p.name}</p>
                      <p className="text-xs text-slate-400 dark:text-zinc-500">{p.city}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-800 dark:text-zinc-200 text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
                        {p.plan}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-zinc-100">
                      {formatCOP(p.mrr)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800 dark:text-zinc-200">{p.adminName}</p>
                      <p className="text-xs text-slate-400 dark:text-zinc-500">{p.adminEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-center font-medium text-slate-700 dark:text-zinc-300">
                      {p.units ? p.units : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-4">
                      <BillingBadge status={p.billingStatus} />
                    </td>
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectProperty(p)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-zinc-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        <IconEye className="h-3.5 w-3.5" />
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
