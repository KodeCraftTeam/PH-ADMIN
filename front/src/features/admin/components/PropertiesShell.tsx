"use client";

import { ReactNode, useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { IconBuilding } from "@/components/ui";
import { getSession } from "@/features/auth/model/session";
import { PropertiesSidebar } from "./PropertiesSidebar";

export function PropertiesShell({ children }: { children: ReactNode }) {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const session = getSession();

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-zinc-950 font-sans text-slate-900 dark:text-zinc-100 transition-colors flex flex-col">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md transition-colors h-14 w-full flex-shrink-0">
        <div className="w-full flex h-full items-center justify-between gap-3 px-3 sm:px-6 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowMobileSidebar(true)}
              aria-label="Abrir menú"
              className="md:hidden text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
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

      <div className="w-full flex flex-1 min-h-[calc(100vh-3.5rem)]">
        <PropertiesSidebar
          isMobileOpen={showMobileSidebar}
          onCloseMobile={() => setShowMobileSidebar(false)}
          userName={session?.name}
        />

        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
