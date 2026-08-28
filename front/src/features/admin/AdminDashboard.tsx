"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminOverviewView } from "./views/AdminOverviewView";
import { AdminBillingView } from "./views/AdminBillingView";
import { AdminPqrsView } from "./views/AdminPqrsView";
import { AdminBroadcastsView } from "./views/AdminBroadcastsView";
import { type ManagedProperty } from "./model/adminPropertiesMock";
import { toManagedProperty } from "./model/mapPropertyListItem";
import { formatUnitTypeBreakdown } from "./model/formatUnitTypeBreakdown";
import { AdminHeader } from "./components/AdminHeader";
import { AdminViewMode } from "./model/types";
import { getAdministratorProperties } from "../onboarding/api/onboarding.api";
import { getPropertyOverview, type PropertyOverview } from "./api/overview.api";
import { getSession, Session } from "../auth/model/session";

export function AdminDashboard({ id: propertyId } : { id: string }) {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<AdminViewMode>("overview");
  const [properties, setProperties] = useState<ManagedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<PropertyOverview | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const session : Session | null = getSession();

  useEffect(() => {
    let cancelled = false;
    getAdministratorProperties()
      .then((items) => {
        if (cancelled) return;
        setProperties(items.map(toManagedProperty));
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError("No se pudieron cargar tus copropiedades.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!propertyId) return;
    let cancelled = false;
    getPropertyOverview(propertyId)
      .then((result) => {
        if (!cancelled) setOverview(result);
      })
      .catch(() => {
        // Las métricas de overview son secundarias al resto del dashboard; fallan en silencio.
      });
    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  const activeProperty = properties.find((p) => p.id === propertyId);

  // Aún no hay módulo de PQRS — se muestra 0 en vez de un número inventado.
  const pendingPqrsCount = 0;

  function handleQuickAction(actionId: string) {
    if (actionId === "billing") setCurrentView("billing");
    else if (actionId === "broadcast") setCurrentView("broadcasts");
    else if (actionId === "pqrs") setCurrentView("pqrs");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/70 dark:bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-ph-200 border-t-ph-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/70 dark:bg-zinc-950 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!activeProperty) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/70 dark:bg-zinc-950 text-sm text-slate-500">
        No se encontró esta copropiedad, o no tienes acceso a ella.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-zinc-950 font-sans text-slate-900 dark:text-zinc-100 transition-colors flex flex-col">
      <AdminHeader
        onCloseMobile={() => setShowMobileSidebar(true)}
        activeProperty={activeProperty}
        propertiesList={properties}
        onSelectProperty={(p) => router.push(`/admin/${p.id}`)}
      />

      <div className="w-full flex flex-1 min-h-[calc(100vh-3.5rem)]">
        <AdminSidebar
          isMobileOpen={showMobileSidebar}
          onCloseMobile={() => setShowMobileSidebar(false)}
          currentView={currentView}
          onSelectView={setCurrentView}
          pendingPqrsCount={pendingPqrsCount}
          overdueCount={overview?.overdueUnits ?? 0}
          userName={session?.name}
          activeProperty={activeProperty}
        />

        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 space-y-6 overflow-x-hidden">
          {currentView === "overview" && (
            <AdminOverviewView
              pendingBalanceTotal={overview?.pendingBalanceTotal ?? 0}
              unitsWithBalance={overview?.unitsWithBalance ?? 0}
              overdueUnits={overview?.overdueUnits ?? 0}
              paymentPlanUnits={overview?.paymentPlanUnits ?? 0}
              totalUnits={overview?.totalUnits ?? 0}
              unitsBreakdownLabel={
                overview ? formatUnitTypeBreakdown(overview.unitsByType) : ""
              }
              onQuickAction={handleQuickAction}
            />
          )}

          {currentView === "billing" && <AdminBillingView />}

          {currentView === "pqrs" && <AdminPqrsView />}

          {currentView === "broadcasts" && <AdminBroadcastsView />}
        </main>
      </div>
    </div>
  );
}
