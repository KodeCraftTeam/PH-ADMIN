"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, IconBuilding, IconCheck, IconSearch, IconChevronRight } from "@/components/ui";
import { getAdministratorProperties, type PropertyListItem } from "@/features/onboarding/api/onboarding.api";

function CopropiedadesPageContent() {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdministratorProperties()
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error obteniendo copropiedades:", err);
        setError("No se pudieron cargar las copropiedades desde la base de datos.");
        setLoading(false);
      });
  }, []);

  const filtered = properties.filter((p) => {
    const query = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      p.taxId.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-zinc-950 font-sans text-slate-900 dark:text-zinc-100 transition-colors p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link href="/admin" className="hover:text-emerald-600 font-medium">Dashboard Admin</Link>
              <span>/</span>
              <span className="text-slate-700 dark:text-zinc-200 font-semibold">Mis Copropiedades</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Mis Copropiedades (Base de Datos)
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-500 dark:text-zinc-400">
              Gestión real de conjuntos y copropiedades registradas en la plataforma.
            </p>
          </div>

          <Link href="/onboarding">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 shadow-md border-0 cursor-pointer">
              + Registrar Nueva Copropiedad
            </Button>
          </Link>
        </div>

        {/* Control Bar: Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="relative flex-1 max-w-md w-full">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar copropiedad por nombre, ciudad o NIT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Total en BD: <span className="text-slate-900 dark:text-zinc-100 font-bold">{properties.length}</span>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-12 text-center text-slate-400 text-sm">
            Cargando copropiedades desde la base de datos...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <Card className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400 mb-4">
              <IconBuilding className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
              No tienes copropiedades registradas aún
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
              Inicia el proceso de Onboarding para registrar tu primera copropiedad y guardarla en la base de datos.
            </p>
            <div className="mt-6">
              <Link href="/onboarding">
                <Button className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs">
                  Comenzar Onboarding
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Grid Display */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((prop) => (
              <Card
                key={prop.id}
                className="p-6 hover:shadow-lg transition-all border-slate-200 dark:border-zinc-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md shrink-0">
                        <IconBuilding className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
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

                  <div className="grid grid-cols-2 gap-3 my-4 py-3 border-y border-slate-100 dark:border-zinc-800 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Tipo de Conjunto</span>
                      <span className="font-semibold text-slate-700 dark:text-zinc-200">{prop.type}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Total Unidades</span>
                      <span className="font-semibold text-slate-700 dark:text-zinc-200">{prop.totalUnits} inmuebles</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">ID: {prop.id.substring(0, 8)}...</span>
                  <Link href="/admin">
                    <Button variant="secondary" className="text-xs font-semibold py-1.5 px-3">
                      Gestionar <IconChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminCopropiedadesPage() {
  return <CopropiedadesPageContent />;
}
