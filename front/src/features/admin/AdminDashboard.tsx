"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, IconBuilding, IconCheck, IconUser } from "@/components/ui";
import { BALANCE_MOCK } from "@/features/onboarding/model/mocks";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getSession, setSession } from "@/features/auth/model/session";
import { getMe } from "@/features/auth/api/me.api";
import { AdminSidebar, type AdminViewMode } from "./components/AdminSidebar";
import { AdminOverviewView } from "./views/AdminOverviewView";
import { AdminCarteraView } from "./views/AdminCarteraView";
import { AdminPqrsView } from "./views/AdminPqrsView";
import { AdminBroadcastsView } from "./views/AdminBroadcastsView";
import { AdminPropertiesHubView } from "./views/AdminPropertiesHubView";
import { ADMIN_PQRS_MOCK } from "./model/adminMocks";
import { ADMIN_MANAGED_PROPERTIES, type ManagedProperty } from "./model/adminPropertiesMock";
import { CompleteAdminProfileModal } from "./components/CompleteAdminProfileModal";

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState<AdminViewMode>("overview");
  const [activeProperty, setActiveProperty] = useState<ManagedProperty>(ADMIN_MANAGED_PROPERTIES[0]);
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const session = getSession();
  const balance = BALANCE_MOCK;
  const totalBalance = balance.reduce((a, c) => a + c.initialBalance, 0);
  const overdue = balance.filter((c) => c.status === "En mora").length;
  const paymentPlans = balance.filter((c) => c.status === "Acuerdo de pago").length;
  const pendingPqrsCount = ADMIN_PQRS_MOCK.filter((p) => p.status !== "Resuelto").length;

  useEffect(() => {
    // Check session status on mount
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
        // Fallback to local session check if offline or mock
        if (session?.needsOnBoarding) {
          setShowCompleteModal(true);
        }
      });
  }, [session?.needsOnBoarding]);

  function handleSelectProperty(prop: ManagedProperty) {
    setActiveProperty(prop);
    setCurrentView("overview");
    setShowPropertyDropdown(false);
  }

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
          
          {/* Header Property Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPropertyDropdown((prev) => !prev)}
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group text-left"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md shadow-slate-900/10 shrink-0">
                <IconBuilding className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm md:text-base font-bold text-slate-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {activeProperty.name}
                  </span>
                  <Badge
                    tone={
                      activeProperty.status === "Activo"
                        ? "green"
                        : activeProperty.status === "En Onboarding"
                        ? "amber"
                        : "red"
                    }
                  >
                    {activeProperty.status === "Activo" && <IconCheck className="h-3 w-3" />}
                    {activeProperty.status}
                  </Badge>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-400">
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-zinc-400">
                  NIT {activeProperty.nit} · {activeProperty.city} · {activeProperty.unitsCount} unidades
                </p>
              </div>
            </button>

            {/* Property Switcher Menu Dropdown */}
            {showPropertyDropdown && (
              <div className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-white dark:bg-zinc-900 p-3 shadow-2xl border border-slate-200 dark:border-zinc-800 z-50 animate-pop-in">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-zinc-800 mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Mis Copropiedades
                  </span>
                  <button
                    onClick={() => {
                      setCurrentView("properties");
                      setShowPropertyDropdown(false);
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
                      onClick={() => handleSelectProperty(prop)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                        prop.id === activeProperty.id
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

                      {prop.id === activeProperty.id && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2 my-1 border-t border-slate-100 dark:border-zinc-800">
                  <Link
                    href="/onboarding"
                    onClick={() => setShowPropertyDropdown(false)}
                    className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-800 dark:text-zinc-200 transition-colors"
                  >
                    + Registrar Nueva Copropiedad
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <ThemeToggle />

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-zinc-800"></div>

            <nav className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentView("properties")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 px-2.5 py-1.5 font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
              >
                🏢 Ver Proyectos
              </button>
              <button
                type="button"
                onClick={() => setShowCompleteModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1.5 font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
              >
                <IconUser className="h-3.5 w-3.5" />
                Completar Perfil
              </button>
              <Link
                href="/onboarding"
                className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 font-medium hidden sm:inline"
              >
                Onboarding
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
          activeProperty={activeProperty}
        />

        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 space-y-6 overflow-x-hidden">
          {currentView === "properties" && (
            <AdminPropertiesHubView
              onSelectProperty={handleSelectProperty}
            />
          )}

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

      {/* Modal para completar registro del Administrador */}
      <CompleteAdminProfileModal
        isOpen={showCompleteModal}
        onSuccess={() => setShowCompleteModal(false)}
      />
    </div>
  );
}
