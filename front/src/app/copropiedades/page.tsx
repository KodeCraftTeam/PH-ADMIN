"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { Badge, Button, Card, IconBuilding, IconCheck, IconSearch, IconChevronRight } from "@/components/ui";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
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
    <div className="min-h-screen bg-slate-50/70 dark:bg-zinc-950 font-sans text-slate-900 dark:text-zinc-100 transition-colors flex flex-col">
      {/* Fixed Sticky Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md transition-colors h-14 w-full flex-shrink-0">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md shadow-slate-900/10 shrink-0">
              <IconBuilding className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                KodeCraft PH
              </p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                Portal de Administración
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Banner / Hero Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900 p-6 md:p-8 text-white shadow-xl border border-slate-800">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-10 h-48 w-48 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold backdrop-blur-md mb-3 border border-white/10">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Copropiedades Registradas
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Mis Copropiedades
                </h1>
                <p className="mt-1.5 text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Selecciona cualquiera de tus copropiedades registradas para gestionar su información, cartera, residentes, PQRS y comunicados.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link href="/registro-copropiedad">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 shadow-lg shadow-emerald-500/20 border-0 cursor-pointer">
                    + Registrar Nueva Copropiedad
                  </Button>
                </Link>
              </div>
            </div>

            {/* Metric Strip */}
            <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Copropiedades en BD
                </p>
                <p className="mt-1 text-xl font-bold text-white">
                  {properties.length}{" "}
                  <span className="text-xs font-normal text-slate-400">registradas</span>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Inmuebles
                </p>
                <p className="mt-1 text-xl font-bold text-emerald-400">
                  {properties.reduce((acc, p) => acc + (p.totalUnits || 0), 0)}{" "}
                  <span className="text-xs font-normal text-slate-400">unidades declaradas</span>
                </p>
              </div>
            </div>
          </div>

          {/* Control Bar: Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
            <div className="relative flex-1 max-w-md w-full">
              <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por conjunto, ciudad o NIT..."
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
                Registra tu primera copropiedad para comenzar a administrarla en el panel.
              </p>
              <div className="mt-6">
                <Link href="/registro-copropiedad">
                  <Button className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs">
                    + Registrar Nueva Copropiedad
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
                      <Button variant="secondary" className="text-xs font-semibold py-1.5 px-3 cursor-pointer">
                        Administrar <IconChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CopropiedadesPage() {
  return (
    <RequireRole role="ADMIN">
      <CopropiedadesPageContent />
    </RequireRole>
  );
}
