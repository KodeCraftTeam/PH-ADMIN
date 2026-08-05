"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Alert, Button, IconBuilding, IconSparkles } from "@/components/ui";
import {
  PROPERTIES_MOCK,
  TICKETS_MOCK,
  type PlatformProperty,
} from "./model/mocks";
import { SuperAdminSidebar, type SuperAdminViewMode } from "./components/SuperAdminSidebar";
import { OverviewView } from "./views/OverviewView";
import { PropertiesView } from "./views/PropertiesView";
import { SubscriptionsView } from "./views/SubscriptionsView";
import { TeamView } from "./views/TeamView";
import { SupportTicketsView } from "./views/SupportTicketsView";
import { BroadcastsView } from "./views/BroadcastsView";
import { SettingsView } from "./views/SettingsView";

import { PropertyDetailModal } from "./components/PropertyDetailModal";
import { CreateAdminModal } from "./components/CreateAdminModal";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getSession } from "@/features/auth/model/session";

export function SuperAdmin() {
  const session = getSession();
  const [currentView, setCurrentView] = useState<SuperAdminViewMode>("overview");
  const [properties, setProperties] = useState<PlatformProperty[]>(PROPERTIES_MOCK);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PlatformProperty | null>(null);
  const [invitationAlert, setInvitationAlert] = useState<string | null>(null);

  // Metrics computation
  const totalMRR = useMemo(() => {
    return properties.reduce(
      (sum, p) => sum + (p.status === "Activo" || p.status === "En onboarding" ? p.mrr : 0),
      0
    );
  }, [properties]);

  const activeCount = useMemo(
    () => properties.filter((p) => p.status === "Activo").length,
    [properties]
  );
  const onboardingCount = useMemo(
    () => properties.filter((p) => p.status === "En onboarding").length,
    [properties]
  );
  const demoCount = useMemo(
    () => properties.filter((p) => p.status === "Demo (Prueba)").length,
    [properties]
  );
  const totalUnits = useMemo(
    () => properties.reduce((sum, p) => sum + (p.units || 0), 0),
    [properties]
  );

  const openTicketsCount = useMemo(
    () => TICKETS_MOCK.filter((t) => t.status !== "Resuelto").length,
    []
  );

  function handleCreateAdmin(newProp: PlatformProperty) {
    setProperties((prev) => [newProp, ...prev]);
    setInvitationAlert(`Invitación comercial enviada a ${newProp.adminEmail}`);
  }

  function handleResendInvite(email: string) {
    setInvitationAlert(`Reenvío de correo de invitación realizado con éxito a ${email}`);
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-zinc-950 font-sans text-slate-900 dark:text-zinc-100 transition-colors flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md transition-colors h-14 w-full flex-shrink-0">
        <div className="w-full flex h-full items-center justify-between px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md shadow-slate-900/10">
              <IconBuilding className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 dark:text-zinc-100">KodeCraft PH</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 dark:bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-white dark:text-zinc-900 uppercase tracking-wider">
                  Super Admin
                </span>
              </div>
            </div>
          </div>

          {/* Action Shortcuts & Theme Toggle */}
          <div className="flex items-center gap-3 text-xs">
            <Button onClick={() => setModalOpen(true)} className="shadow-xs py-1.5 px-3 text-xs">
              + Crear Copropiedad
            </Button>

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-zinc-800"></div>

            <ThemeToggle />

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-zinc-800 hidden md:block"></div>

            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 py-1.5 font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <IconSparkles className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                Demo Onboarding
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 py-1.5 font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Panel Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Container: Sidebar + View Content (Seamless Sticky Sidebar) */}
      <div className="w-full flex flex-1 min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <SuperAdminSidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          propertiesCount={properties.length}
          openTicketsCount={openTicketsCount}
          userName={session?.name}
        />

        {/* View Content Area */}
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 space-y-6 overflow-x-hidden">
          {invitationAlert && (
            <Alert tone="green" title="Notificación del Sistema">
              {invitationAlert}
            </Alert>
          )}

          {currentView === "overview" && (
            <OverviewView
              properties={properties}
              totalMRR={totalMRR}
              activeCount={activeCount}
              onboardingCount={onboardingCount}
              demoCount={demoCount}
              totalUnits={totalUnits}
            />
          )}

          {currentView === "properties" && (
            <PropertiesView
              properties={properties}
              onSelectProperty={setSelectedProperty}
            />
          )}

          {currentView === "subscriptions" && (
            <SubscriptionsView
              properties={properties}
              onSelectProperty={setSelectedProperty}
            />
          )}

          {currentView === "team" && <TeamView />}

          {currentView === "tickets" && <SupportTicketsView />}

          {currentView === "broadcasts" && <BroadcastsView />}

          {currentView === "settings" && <SettingsView />}
        </main>
      </div>

      {/* Modals & Overlays */}
      <CreateAdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateAdmin}
      />

      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onResendInvite={handleResendInvite}
      />
    </div>
  );
}
