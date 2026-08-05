"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Button, IconBuilding, IconCheck } from "@/components/ui";
import { BALANCE_MOCK } from "@/features/onboarding/model/mocks";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getSession } from "@/features/auth/model/session";
import { AdminSidebar, type AdminViewMode } from "./components/AdminSidebar";
import { AdminOverviewView } from "./views/AdminOverviewView";
import { AdminCarteraView } from "./views/AdminCarteraView";
import { AdminPqrsView } from "./views/AdminPqrsView";
import { AdminBroadcastsView } from "./views/AdminBroadcastsView";
import { ADMIN_PQRS_MOCK } from "./model/adminMocks";

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState<AdminViewMode>("overview");
  const session = getSession();
  const balance = BALANCE_MOCK;
  const totalBalance = balance.reduce((a, c) => a + c.initialBalance, 0);
  const overdue = balance.filter((c) => c.status === "En mora").length;
  const paymentPlans = balance.filter((c) => c.status === "Acuerdo de pago").length;
  const pendingPqrsCount = ADMIN_PQRS_MOCK.filter((p) => p.status !== "Resuelto").length;

  function handleQuickAction(actionId: string) {
    if (actionId === "billing" || actionId === "cartera") setCurrentView("cartera");
    else if (actionId === "broadcast") setCurrentView("broadcasts");
    else if (actionId === "pqrs") setCurrentView("pqrs");
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-zinc-950 font-sans text-slate-900 dark:text-zinc-100 transition-colors flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md transition-colors h-14 w-full flex-shrink-0">
        <div className="w-full flex h-full items-center justify-between px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md shadow-slate-900/10">
              <IconBuilding className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 dark:text-zinc-100">Altos del Virrey</span>
                <Badge tone="green">
                  <IconCheck className="h-3 w-3" /> Activo
                </Badge>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-zinc-400">
                NIT 901.456.789-2 · Bogotá D.C. · 18 unidades
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <ThemeToggle />

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-zinc-800"></div>

            <nav className="flex items-center gap-3">
              <Link
                href="/onboarding"
                className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 font-medium"
              >
                Onboarding (demo)
              </Link>
              <Link
                href="/superadmin"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 py-1.5 font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Super Admin Panel
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Layout Container: Sidebar + View Content (Seamless Sticky Sidebar) */}
      <div className="w-full flex flex-1 min-h-[calc(100vh-3.5rem)]">
        <AdminSidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          pendingPqrsCount={pendingPqrsCount}
          overdueCount={overdue}
          userName={session?.name}
        />

        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 space-y-6 overflow-x-hidden">
          {currentView === "overview" && (
            <AdminOverviewView
              totalBalance={totalBalance}
              overdue={overdue}
              paymentPlans={paymentPlans}
              onQuickAction={handleQuickAction}
            />
          )}

          {currentView === "cartera" && <AdminCarteraView />}

          {currentView === "pqrs" && <AdminPqrsView />}

          {currentView === "broadcasts" && <AdminBroadcastsView />}
        </main>
      </div>
    </div>
  );
}
