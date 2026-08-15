"use client";

import { BALANCE_MOCK } from "@/features/onboarding/model/mocks";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminOverviewView } from "./views/AdminOverviewView";
import { AdminBillingView } from "./views/AdminBillingView";
import { AdminPqrsView } from "./views/AdminPqrsView";
import { AdminBroadcastsView } from "./views/AdminBroadcastsView";
import { ADMIN_PQRS_MOCK } from "./model/adminMocks";
import { ADMIN_MANAGED_PROPERTIES, type ManagedProperty } from "./model/adminPropertiesMock";
import { BalanceRow } from "../onboarding/model/types";
import { AdminHeader } from "./components/AdminHeader";
import { AdminViewMode } from "./model/types";
import { useState } from "react";
import { getSession, Session } from "../auth/model/session";

export function AdminDashboard({ id: propertyId } : { id: string }) {
  const [currentView, setCurrentView] = useState<AdminViewMode>("overview");
  const [activeProperty, setActiveProperty] = useState<ManagedProperty>(ADMIN_MANAGED_PROPERTIES[0]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const balance: BalanceRow[] = BALANCE_MOCK;
  const totalBalance: number = balance.reduce((a, c) => a + c.initialBalance, 0);
  const overdue = balance.filter((c) => c.status === "En mora").length;
  const paymentPlans = balance.filter((c) => c.status === "Acuerdo de pago").length;
  const pendingPqrsCount = ADMIN_PQRS_MOCK.filter((p) => p.status !== "Resuelto").length;
  const session : Session | null = getSession();

  function handleQuickAction(actionId: string) {
    if (actionId === "billing") setCurrentView("billing");
    else if (actionId === "broadcast") setCurrentView("broadcasts");
    else if (actionId === "pqrs") setCurrentView("pqrs");
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-zinc-950 font-sans text-slate-900 dark:text-zinc-100 transition-colors flex flex-col">
      {/* Header Bar */}
      <AdminHeader
        onCloseMobile={() => setShowMobileSidebar(true)}
        activeProperty={activeProperty}
        onSelectProperty={setActiveProperty}
      />

      {/* Main Layout Container: Sidebar + View Content */}
      <div className="w-full flex flex-1 min-h-[calc(100vh-3.5rem)]">
        <AdminSidebar
          isMobileOpen={showMobileSidebar}
          onCloseMobile={() => setShowMobileSidebar(false)}
          currentView={currentView}
          onSelectView={setCurrentView}
          pendingPqrsCount={pendingPqrsCount}
          overdueCount={overdue}
          userName={session?.name}
          activeProperty={activeProperty}
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

          {currentView === "billing" && <AdminBillingView />}

          {currentView === "pqrs" && <AdminPqrsView />}

          {currentView === "broadcasts" && <AdminBroadcastsView />}
        </main>
      </div>

      {/* Modal para completar registro del Administrador */}

    </div>
  );
}
