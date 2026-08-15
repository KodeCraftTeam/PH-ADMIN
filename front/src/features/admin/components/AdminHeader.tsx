"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Menu } from "lucide-react";
import { Badge, IconBuilding, IconCheck, IconUser } from "@/components/ui";
import {
  ADMIN_MANAGED_PROPERTIES,
  type ManagedProperty,
} from "../model/adminPropertiesMock";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface Props {
  onCloseMobile: () => void;
  activeProperty?: ManagedProperty;
  onSelectProperty?: (property: ManagedProperty) => void;
  onShowCompleteModal: () => void;
  propertiesList?: ManagedProperty[];
}

export function AdminHeader({
  onCloseMobile,
  activeProperty,
  onSelectProperty,
  onShowCompleteModal,
  propertiesList = ADMIN_MANAGED_PROPERTIES,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md transition-colors h-14 w-full flex-shrink-0">
      <div className="w-full flex h-full items-center justify-between gap-3 px-3 sm:px-6 md:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Abrir menú"
          className="shrink-0 rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Left: Direct Back Button + Dropdown Selector */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Botón directo de regreso a Mis Copropiedades */}
          <Link
            href="/copropiedades"
            title="Volver a Mis Copropiedades"
            aria-label="Volver a Mis Copropiedades"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200/80 dark:border-zinc-700/80 transition-all shadow-xs cursor-pointer group shrink-0"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-150" />
          </Link>

          <div className="h-6 w-[1px] bg-slate-200 dark:border-zinc-800 shrink-0" />

          {/* Selector Desplegable de Copropiedad Activa */}
          <div ref={dropdownRef} className="relative min-w-0">
            <button
              type="button"
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group text-left max-w-full"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm shrink-0">
                <IconBuilding className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {activeProperty?.name || "Altos del Virrey"}
                  </span>
                  <span className="shrink-0 hidden md:inline-flex">
                    <Badge
                      tone={
                        activeProperty?.status === "Activo"
                          ? "green"
                          : activeProperty?.status === "En Onboarding"
                          ? "amber"
                          : "green"
                      }
                    >
                      <IconCheck className="h-3 w-3 mr-1 inline" />
                      {activeProperty?.status || "Activo"}
                    </Badge>
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      showDropdown ? "rotate-180 text-slate-700 dark:text-zinc-200" : ""
                    }`}
                  />
                </div>
                <p className="hidden lg:block truncate text-[10px] text-slate-400 dark:text-zinc-400">
                  NIT {activeProperty?.nit} · {activeProperty?.city} ·{" "}
                  {activeProperty?.unitsCount} unidades
                </p>
              </div>
            </button>

            {/* Dropdown Menu Overlay */}
            {showDropdown && (
              <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-zinc-900 p-3 shadow-2xl border border-slate-200 dark:border-zinc-800 z-50 animate-pop-in">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-zinc-800 mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Mis Copropiedades
                  </span>
                  <Link
                    href="/copropiedades"
                    onClick={() => setShowDropdown(false)}
                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Ver todas →
                  </Link>
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {propertiesList.map((prop) => (
                    <button
                      key={prop.id}
                      onClick={() => {
                        if (onSelectProperty) onSelectProperty(prop);
                        setShowDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                        prop.id === activeProperty?.id
                          ? "bg-slate-100 dark:bg-zinc-800 font-bold text-slate-900 dark:text-zinc-100"
                          : "hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-600 dark:text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900/10 dark:bg-zinc-100/10 text-slate-900 dark:text-zinc-100 text-xs shrink-0">
                          🏢
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{prop.name}</p>
                          <p className="truncate text-[10px] text-slate-400">
                            {prop.city} • {prop.unitsCount} uds
                          </p>
                        </div>
                      </div>

                      {prop.id === activeProperty?.id && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-zinc-800">
                  <Link
                    href="/registro-copropiedad"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-800 dark:text-zinc-200 transition-colors"
                  >
                    + Registrar Nueva Copropiedad
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Theme toggle and profile action */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
          <ThemeToggle />

          <div className="hidden sm:block h-5 w-[1px] bg-slate-200 dark:bg-zinc-800"></div>

          <nav className="flex items-center gap-2">
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
  );
}