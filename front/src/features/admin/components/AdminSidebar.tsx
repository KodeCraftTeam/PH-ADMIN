"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { LogOutIcon } from "lucide-react";
import { IconBuilding, IconChart, IconDollar, IconUsers } from "@/components/ui";
import { useLogout } from "@/features/auth/hooks/useLogout";

import { ManagedProperty } from "../model/adminPropertiesMock";
import { AdminViewMode } from "../model/types";

interface Props {
  currentView: AdminViewMode;
  onSelectView: (view: AdminViewMode) => void;
  pendingPqrsCount: number;
  overdueCount: number;
  userName?: string;
  activeProperty?: ManagedProperty;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  currentView,
  onSelectView,
  pendingPqrsCount,
  overdueCount,
  userName,
  activeProperty,
  isMobileOpen,
  onCloseMobile,
}: Props) {
  const { logout, loading: loggingOut } = useLogout();
  const displayName = userName?.trim() || "Usuario";
  const initials =
    displayName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";
  const menuItems: {
    id: AdminViewMode;
    label: string;
    badge?: string | number;
    icon: (props: { className?: string }) => ReactNode;
  }[] = [
    {
      id: "properties",
      label: "Mis Copropiedades",
      icon: (p) => <IconBuilding className={p.className} />,
    },
    {
      id: "overview",
      label: "Visión General",
      icon: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className || "h-4 w-4"}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      id: "cartera",
      label: "Cartera & Residentes",
      badge: overdueCount > 0 ? `${overdueCount} mora` : undefined,
      icon: (p) => <IconDollar className={p.className} />,
    },
    {
      id: "pqrs",
      label: "PQRS & Atenciones",
      badge: pendingPqrsCount > 0 ? pendingPqrsCount : undefined,
      icon: (p) => <IconUsers className={p.className} />,
    },
    {
      id: "broadcasts",
      label: "Comunicados & Cartelera",
      icon: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className || "h-4 w-4"}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.38-.09-2.072-.09-1.944 0-3.8.31-5.52.88a.75.75 0 01-.998-.707V5.625a.75.75 0 01.998-.707c1.72.57 3.576.88 5.52.88 2.08 0 4.07-.35 5.92-.99A.75.75 0 0115 5.518v9.964a.75.75 0 01-.415.67 19.98 19.98 0 00-4.245.688zM19.5 4.5v15m-3-12v9m6-6v3" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 top-14 z-40 bg-slate-950/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 top-14 z-40 w-72 -translate-x-full border-r border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 backdrop-blur-md flex flex-col justify-between h-[calc(100vh-3.5rem)] overflow-y-auto transition-transform duration-200 md:sticky md:z-30 md:w-64 md:translate-x-0 md:bg-white/95 md:dark:bg-zinc-900/95 md:self-start ${
          isMobileOpen ? "translate-x-0" : ""
        }`}
      >
      <div className="p-4 space-y-4">
        <div className="px-2 py-1">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
            Administración del Conjunto
          </p>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            const content = (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full"></span>
                )}
                <div className="flex items-center gap-3">
                  {item.icon({ className: "h-4 w-4" })}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-colors ${
                      isActive
                        ? "bg-white/20 dark:bg-zinc-900/20 text-white dark:text-zinc-900"
                        : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 group-hover:bg-slate-200 dark:group-hover:bg-zinc-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            );

            const className = `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer group relative ${
              isActive
                ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100/80 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100"
            }`;

            if (item.id === "properties") {
              return (
                <Link key={item.id} href="/admin/copropiedades" onClick={onCloseMobile} className={className}>
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={className}
              >
                {content}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-zinc-800/80 space-y-3 mt-auto bg-white/50 dark:bg-zinc-900/50">
        <button
          type="button"
          onClick={() => {
            onSelectView("properties");
            onCloseMobile();
          }}
          className="w-full text-left rounded-xl border border-slate-200/60 dark:border-zinc-800/60 bg-slate-50/80 dark:bg-zinc-800/30 p-3 backdrop-blur-xs hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div>
                <p className="text-[11px] font-bold text-slate-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {activeProperty?.name || "Altos del Virrey"}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                  {activeProperty ? `${activeProperty.unitsCount} Uds • Plan ${activeProperty.plan}` : "18 Unidades • Plan Enterprise"}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300">
              Cambiar ⚙️
            </span>
          </div>
        </button>

        <div className="flex items-center justify-between px-1 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-[11px] shadow-xs">
              {initials}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-zinc-100 text-[11px]">{displayName}</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500">Administrador</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className="text-slate-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <LogOutIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      </aside>
    </>
  );
}
