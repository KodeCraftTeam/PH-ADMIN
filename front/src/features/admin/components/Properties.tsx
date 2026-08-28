'use client';
import { Badge, Button, Card, IconBuilding, IconCheck, IconChevronRight, IconSearch } from "@/components/ui";
import { getAdministratorProperties, PropertyListItem } from "@/features/onboarding/api/onboarding.api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PropertiesShell } from "./PropertiesShell";
import { getMe } from "@/features/auth/api/me.api";
import { CompleteAdminProfileModal } from "./CompleteAdminProfileModal";
import { getSession, Session, setSession } from "@/features/auth/model/session";

export default function Properties() {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const session: Session | null = getSession();

  useEffect(() => {
    getMe()
      .then((user) => {
        if (user) {
          setSession({ name: user.name, role: user.role, needsOnBoarding: user.needsOnBoarding });
          if (user.needsOnBoarding) {
            setShowCompleteModal(true);
          }
        }
      })
      .catch(() => {
        if (session?.needsOnBoarding) {
          setShowCompleteModal(true);
        }
      });
  }, [session?.needsOnBoarding]);

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
    <PropertiesShell>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900 p-5 md:p-6 text-white shadow-xl border border-slate-800">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-400 text-[11px] font-semibold backdrop-blur-md mb-2 border border-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Copropiedades Registradas
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                  Mis Copropiedades
                </h1>
                <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Selecciona cualquiera de tus copropiedades registradas para gestionar su información, cartera, residentes, PQRS y comunicados.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="hidden sm:flex items-center gap-4 pr-4 border-r border-white/10">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      En BD
                    </p>
                    <p className="text-sm font-bold text-white">
                      {properties.length} <span className="font-normal text-slate-400">copropiedades</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Inmuebles
                    </p>
                    <p className="text-sm font-bold text-emerald-400">
                      {properties.reduce((acc, p) => acc + (p.totalUnits || 0), 0)}{" "}
                      <span className="font-normal text-slate-400">unidades</span>
                    </p>
                  </div>
                </div>
                <Link href="/register-coproperty">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 text-xs shadow-lg shadow-emerald-500/20 border-0 cursor-pointer">
                    + Registrar Nueva Copropiedad
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <IconSearch className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Buscar por conjunto, ciudad o NIT..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-zinc-700 transition-all shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-500 dark:text-zinc-400">
              <span>Total: <strong>{filtered.length}</strong></span>
              <div className="flex items-center rounded-lg border border-slate-200 dark:border-zinc-800 p-0.5 bg-slate-100 dark:bg-zinc-800/60">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                  }`}
                >
                  Tarjetas
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    viewMode === "table"
                      ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                  }`}
                >
                  Lista
                </button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="py-12 text-center text-slate-400 text-sm">
              Cargando copropiedades desde la base de datos...
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
              {error}
            </div>
          )}

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
              <div className="mt-6 flex items-center justify-center">
                <Link href="/register-coproperty">
                  <Button className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs">
                    + Registrar Nueva Copropiedad
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {!loading && !error && filtered.length > 0 && viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((prop) => (
                <Card
                  key={prop.id}
                  className="group p-6 hover:shadow-lg hover:border-slate-300 dark:hover:border-zinc-700 transition-all border-slate-200 dark:border-zinc-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-md shrink-0 ${
                            prop.status === "ACTIVO"
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                          }`}
                        >
                          <IconBuilding className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 truncate">
                            {prop.name}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium truncate">
                            NIT {prop.taxId} · {prop.city}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0">
                        <Badge tone={prop.status === "ACTIVO" ? "green" : "amber"}>
                          {prop.status === "ACTIVO" && <IconCheck className="h-3 w-3 mr-1 inline" />}
                          {prop.status}
                        </Badge>
                      </span>
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

                  <Link href={`/admin/${prop.id}`} className="block">
                    <Button className="w-full justify-center text-xs font-semibold py-2 cursor-pointer bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 dark:group-hover:text-white transition-colors">
                      Administrar <IconChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && viewMode === "table" && (
            <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-140 text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-semibold border-b border-slate-200 dark:border-zinc-800">
                    <tr>
                      <th className="py-3.5 px-4">Copropiedad</th>
                      <th className="py-3.5 px-4">Ciudad / NIT</th>
                      <th className="py-3.5 px-4">Unidades</th>
                      <th className="py-3.5 px-4">Dirección</th>
                      <th className="py-3.5 px-4">Estado</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {filtered.map((prop) => (
                      <tr key={prop.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-zinc-100">
                          {prop.name}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400">
                          {prop.city} · {prop.taxId}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-zinc-200">{prop.totalUnits} uds</td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400">{prop.address}</td>
                        <td className="py-3.5 px-4">
                          <Badge tone={prop.status === "ACTIVO" ? "green" : "amber"}>
                            {prop.status === "ACTIVO" && <IconCheck className="h-3 w-3 mr-1 inline" />}
                            {prop.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link href={`/admin/${prop.id}`}>
                            <Button variant="secondary" className="text-xs font-semibold py-1.5 px-3 cursor-pointer">
                              Administrar <IconChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>


    <CompleteAdminProfileModal
      isOpen={showCompleteModal}
      onSuccess={() => setShowCompleteModal(false)}
    />
    </PropertiesShell>


  );
}