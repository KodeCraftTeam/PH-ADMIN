"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon } from "lucide-react";
import { IconBuilding, IconUser } from "@/components/ui";
import { useLogout } from "@/features/auth/hooks/useLogout";

interface Props {
  userName?: string;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function PropertiesSidebar({ userName, isMobileOpen, onCloseMobile }: Props) {
  const pathname = usePathname();
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
    href: string;
    label: string;
    icon: (props: { className?: string }) => ReactNode;
  }[] = [
    {
      href: "/admin",
      label: "Mis Copropiedades",
      icon: (p) => <IconBuilding className={p.className} />,
    },
    {
      href: "/admin/profile",
      label: "Perfil",
      icon: (p) => <IconUser className={p.className} />,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed top-14 left-0 bottom-0 z-40 w-64 border-r border-slate-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto transition-transform duration-200 ease-in-out md:sticky md:top-14 md:z-20 md:h-[calc(100vh-3.5rem)] md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 space-y-4">
          <div className="px-2 py-1">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
              Mi Cuenta
            </p>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer group relative ${
                    isActive
                      ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                      : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100/80 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full"></span>
                  )}
                  <div className="flex items-center gap-3">
                    {item.icon({ className: "h-4 w-4" })}
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-zinc-800/80 space-y-3 mt-auto bg-white/50 dark:bg-zinc-900/50">
          <Link
            href="/registro-copropiedad"
            onClick={onCloseMobile}
            className="block w-full text-left rounded-xl border border-slate-200/60 dark:border-zinc-800/60 bg-slate-50/80 dark:bg-zinc-800/30 p-3 backdrop-blur-xs hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <div>
                  <p className="text-[11px] font-bold text-slate-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Registrar Copropiedad
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                    Agrega un nuevo conjunto
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300">
                Crear +
              </span>
            </div>
          </Link>

          <div className="flex items-center justify-between px-1 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-[11px] shadow-xs">
                {initials}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-zinc-100 text-[11px]">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                  Administrador
                </p>
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
