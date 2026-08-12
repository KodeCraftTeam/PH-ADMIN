"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Badge, Button, Card, IconBuilding, IconCheck, IconSearch, IconChevronRight } from "@/components/ui";
import { getAdministratorProperties, type PropertyListItem } from "@/features/onboarding/api/onboarding.api";
import type { ManagedProperty } from "../model/adminPropertiesMock";

interface Props {
  onSelectProperty: (property: ManagedProperty) => void;
  onNewPropertyClick?: () => void;
}

export function AdminPropertiesHubView({ onSelectProperty }: Props) {
  const [dbProperties, setDbProperties] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  useEffect(() => {
    getAdministratorProperties()
      .then((data) => {
        setDbProperties(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error obteniendo copropiedades de BD:", err);
        setLoading(false);
      });
  }, []);

  const filteredProperties = useMemo(() => {
    return dbProperties.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        p.taxId.includes(search);
      return matchSearch;
    });
  }, [dbProperties, search]);

  const totalUnits = useMemo(
    () => dbProperties.reduce((acc, p) => acc + (p.totalUnits || 0), 0),
    [dbProperties]
  );

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
              Copropiedades Reales en Base de Datos
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Mis Copropiedades
            </h1>
            <p className="mt-1.5 text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Selecciona cualquiera de tus copropiedades registradas para gestionar su información y administración.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/admin/copropiedades">
              <Button className="bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs px-4 py-2.5">
                Ver Ruta /admin/copropiedades
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 shadow-lg shadow-emerald-500/20 border-0 cursor-pointer">
                + Nueva Copropiedad
              </Button>
            </Link>
          </div>
        </div>

        {/* Global Summary Metric Strip */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-2 gap-4 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Copropiedades Registradas
            </p>
            <p className="mt-1 text-xl font-bold text-white">
              {dbProperties.length}{" "}
              <span className="text-xs font-normal text-slate-400">en PostgreSQL</span>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Inmuebles
            </p>
            <p className="mt-1 text-xl font-bold text-white">
              {totalUnits}{" "}
              <span className="text-xs font-normal text-slate-400">unidades declaradas</span>
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & View Options */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por conjunto, ciudad o NIT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
            }`}
          >
            Tarjetas
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              viewMode === "table"
                ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
            }`}
          >
            Lista
          </button>
        </div>
      </div>

      {loading && (
        <div className="py-12 text-center text-slate-400 text-sm">
          Cargando copropiedades desde la base de datos...
        </div>
      )}

      {!loading && filteredProperties.length === 0 && (
        <Card className="p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400 mb-4">
            <IconBuilding className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
            No tienes copropiedades registradas aún en la BD
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Registra una copropiedad desde la página de onboarding para comenzar a ver tus datos reales aquí.
          </p>
          <div className="mt-6">
            <Link href="/onboarding">
              <Button className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs">
                Ir a Onboarding
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Grid Mode Display */}
      {!loading && filteredProperties.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProperties.map((prop) => (
            <Card
              key={prop.id}
              className="group relative overflow-hidden p-6 hover:shadow-xl transition-all border-slate-200 dark:border-zinc-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md shrink-0">
                      <IconBuilding className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                        {prop.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        NIT {prop.taxId} · {prop.city}
                      </p>
                    </div>
                  </div>

                  <Badge tone={prop.status === "ACTIVO" ? "green" : "amber"}>
                    {prop.status === "ACTIVO" && <IconCheck className="h-3 w-3 mr-1 inline" />}
                    {prop.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 py-2 text-[11px] text-slate-500 border-y border-slate-100 dark:border-zinc-800/80 my-3">
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">
                    Tipo: {prop.type}
                  </span>
                  <span>•</span>
                  <span>{prop.totalUnits} unidades</span>
                  <span>•</span>
                  <span className="font-medium text-slate-600 dark:text-zinc-300">
                    Dirección: {prop.address}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-400">
                  ID: {prop.id.substring(0, 8)}...
                </span>

                <Button
                  onClick={() =>
                    onSelectProperty({
                      id: prop.id,
                      name: prop.name,
                      nit: prop.taxId,
                      city: prop.city,
                      unitsCount: prop.totalUnits,
                      status: prop.status === "ACTIVO" ? "Activo" : "En Onboarding",
                      plan: "Pro",
                      recaudoPercentage: 100,
                      pendingBalance: 0,
                      overdueUnits: 0,
                      pendingPqrs: 0,
                      type: prop.type === "RESIDENCIAL" ? "Residencial" : "Comercial",
                      lastBackupDate: "Hoy",
                      imageAccent: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
                    })
                  }
                  className="bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold px-4 py-2 text-xs rounded-xl cursor-pointer"
                >
                  Administrar
                  <IconChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Table Mode Display */}
      {!loading && filteredProperties.length > 0 && viewMode === "table" && (
        <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
          <table className="w-full min-w-140 text-left text-xs">
            <thead className="bg-slate-50 dark:bg-zinc-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Copropiedad</th>
                <th className="py-3.5 px-4">Ciudad / NIT</th>
                <th className="py-3.5 px-4">Unidades</th>
                <th className="py-3.5 px-4">Dirección</th>
                <th className="py-3.5 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredProperties.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-zinc-100">
                    {prop.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {prop.city} · {prop.taxId}
                  </td>
                  <td className="py-3.5 px-4 font-medium">{prop.totalUnits} uds</td>
                  <td className="py-3.5 px-4 text-slate-500">{prop.address}</td>
                  <td className="py-3.5 px-4">
                    <Badge tone={prop.status === "ACTIVO" ? "green" : "amber"}>
                      {prop.status}
                    </Badge>
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
