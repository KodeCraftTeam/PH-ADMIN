import { Badge, IconBuilding, IconCheck, IconUser } from "@/components/ui";
import { Link, Menu } from "lucide-react";
import { ADMIN_MANAGED_PROPERTIES, ManagedProperty } from "../model/adminPropertiesMock";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { AdminViewMode } from "../model/types";

interface props {
  onCloseMobile: () => void;
  onShowPropertyDropdown: (show: boolean) => void;
  showPropertyDropdown: boolean;
  activeProperty?: ManagedProperty;
  onSelectView: (view: AdminViewMode) => void;
  onSelectProperty: (property: ManagedProperty) => void;
  onShowCompleteModal: () => void
}

export function AdminHeader ({ onCloseMobile, onShowPropertyDropdown, showPropertyDropdown, activeProperty, onSelectView, onSelectProperty, onShowCompleteModal  }: props) {

  return (
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md transition-colors h-14 w-full flex-shrink-0">
        <div className="w-full flex h-full items-center justify-between gap-2 px-3 sm:px-6 md:px-8">
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Abrir menú"
            className="shrink-0 rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Header Property Selector Dropdown */}
          <div className="relative min-w-0 flex-1 md:flex-initial">
            <button
              type="button"
              onClick={() => onShowPropertyDropdown(!showPropertyDropdown)}
              className="flex w-full min-w-0 items-center gap-2 sm:gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group text-left"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md shadow-slate-900/10 shrink-0">
                <IconBuilding className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="truncate text-sm md:text-base font-bold text-slate-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {activeProperty?.name}
                  </span>
                  <span className="hidden sm:inline-flex shrink-0">
                    <Badge
                      tone={
                        activeProperty?.status === "Activo"
                          ? "green"
                          : activeProperty?.status === "En Onboarding"
                          ? "amber"
                          : "red"
                      }
                    >
                      {activeProperty?.status === "Activo" && <IconCheck className="h-3 w-3" />}
                      {activeProperty?.status}
                    </Badge>
                  </span>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-400 shrink-0">
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="hidden sm:block truncate text-[10px] text-slate-400 dark:text-zinc-400">
                  NIT {activeProperty?.nit} · {activeProperty?.city} · {activeProperty?.unitsCount} unidades
                </p>
              </div>
            </button>

            {/* Property Switcher Menu Dropdown */}
            {showPropertyDropdown && (
              <div className="absolute top-full left-0 mt-2 w-[calc(100vw-1.5rem)] max-w-80 rounded-2xl bg-white dark:bg-zinc-900 p-3 shadow-2xl border border-slate-200 dark:border-zinc-800 z-50 animate-pop-in">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-zinc-800 mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Mis Copropiedades
                  </span>
                  <button
                      onClick={() => {
                        onSelectView("properties");
                        onShowPropertyDropdown(false);
                      }}
                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Ver todas →
                  </button>
                </div>

                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {ADMIN_MANAGED_PROPERTIES.map((prop) => (
                    <button
                      key={prop.id}
                      onClick={() => onSelectProperty(prop)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                        prop.id === activeProperty?.id
                          ? "bg-slate-100 dark:bg-zinc-800 font-bold text-slate-900 dark:text-zinc-100"
                          : "hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-600 dark:text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900/10 dark:bg-zinc-100/10 text-slate-900 dark:text-zinc-100 text-xs">
                          🏢
                        </span>
                        <div>
                          <p className="font-semibold">{prop.name}</p>
                          <p className="text-[10px] text-slate-400">{prop.city} • {prop.unitsCount} uds</p>
                        </div>
                      </div>

                      {prop.id === activeProperty?.id && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2 my-1 border-t border-slate-100 dark:border-zinc-800">
                  <Link
                    href="/onboarding"
                    onClick={() => onShowPropertyDropdown(false)}
                    className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-800 dark:text-zinc-200 transition-colors"
                  >
                    + Registrar Nueva Copropiedad
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 text-xs shrink-0">
            <ThemeToggle />

            <div className="hidden sm:block h-5 w-[1px] bg-slate-200 dark:bg-zinc-800"></div>

            <nav className="flex items-center gap-1.5 sm:gap-3">
              <button
                type="button"
                onClick={() => onSelectView("properties")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 px-2 sm:px-2.5 py-1.5 font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
              >
                🏢<span className="hidden sm:inline">&nbsp;Ver Proyectos</span>
              </button>
              <button
                type="button"
                onClick={onShowCompleteModal}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 px-2 sm:px-2.5 py-1.5 font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
              >
                <IconUser className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Completar Perfil</span>
              </button>
            </nav>
          </div>
        </div>
      </header>
  )
}