"use client";

import { Card, IconBuilding, IconChart, IconDollar, IconTrendingUp, IconUsers } from "@/components/ui";
import { PlatformProperty } from "../model/mocks";
import { RevenueTrendChart, formatCOP } from "../components/charts/RevenueTrendChart";
import { GrowthMetricsChart } from "../components/charts/GrowthMetricsChart";
import { PropertyDistributionChart } from "../components/charts/PropertyDistributionChart";

interface Props {
  properties: PlatformProperty[];
  totalMRR: number;
  activeCount: number;
  onboardingCount: number;
  demoCount: number;
  totalUnits: number;
}

export function OverviewView({
  properties,
  totalMRR,
  activeCount,
  onboardingCount,
  demoCount,
  totalUnits,
}: Props) {
  return (
    <div className="space-y-6 animate-pop-in">
      {/* High-Impact KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
              MRR Facturado
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <IconDollar className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
            {formatCOP(totalMRR)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
            <IconTrendingUp className="h-3.5 w-3.5" />
            <span>+31.4% vs mes anterior</span>
          </div>
        </Card>

        <Card className="p-5 border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
              Conjuntos Activos
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <IconBuilding className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
            {activeCount} <span className="text-sm font-normal text-slate-400 dark:text-zinc-500">/ {properties.length}</span>
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">
            Tasa de retención comercial: <strong className="text-slate-800 dark:text-zinc-200">96.8%</strong>
          </p>
        </Card>

        <Card className="p-5 border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
              En Onboarding & Demos
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <IconUsers className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
            {onboardingCount + demoCount}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">
            {onboardingCount} en wizard • {demoCount} demos activos
          </p>
        </Card>

        <Card className="p-5 border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
              Unidades Totales
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <IconChart className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
            {totalUnits.toLocaleString("es-CO")}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">
            Promedio: <strong className="text-slate-800 dark:text-zinc-200">{(totalUnits / (activeCount || 1)).toFixed(0)} uds/conjunto</strong>
          </p>
        </Card>
      </div>

      {/* Side-by-Side 2-Column Grid Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueTrendChart />
        <GrowthMetricsChart />
      </div>

      {/* Property Distribution & Tiers Chart */}
      <PropertyDistributionChart properties={properties} />
    </div>
  );
}
