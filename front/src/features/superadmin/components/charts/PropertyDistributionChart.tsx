"use client";

import { Card } from "@/components/ui";
import { type PlatformProperty } from "../../model/mocks";
import { formatCOP } from "./RevenueTrendChart";

interface Props {
  properties: PlatformProperty[];
}

export function PropertyDistributionChart({ properties }: Props) {
  const activeCount = properties.filter((p) => p.status === "Activo").length;
  const onboardingCount = properties.filter((p) => p.status === "En onboarding").length;
  const demoCount = properties.filter((p) => p.status === "Demo (Prueba)").length;
  const invitedCount = properties.filter((p) => p.status === "Invitación enviada").length;

  const total = properties.length || 1;

  const statusSegments = [
    { label: "Activos", count: activeCount, color: "#10b981", percent: Math.round((activeCount / total) * 100) },
    { label: "En onboarding", count: onboardingCount, color: "#0284c7", percent: Math.round((onboardingCount / total) * 100) },
    { label: "Demo / Prueba", count: demoCount, color: "#f59e0b", percent: Math.round((demoCount / total) * 100) },
    { label: "Invitación", count: invitedCount, color: "#94a3b8", percent: Math.round((invitedCount / total) * 100) },
  ];

  // Calculate SVG Donut strokes
  let accumulatedPercent = 0;
  const donutSegments = statusSegments.map((s) => {
    const strokeDasharray = `${s.percent} ${100 - s.percent}`;
    const strokeDashoffset = 100 - accumulatedPercent + 25;
    accumulatedPercent += s.percent;
    return { ...s, strokeDasharray, strokeDashoffset };
  });

  // Plan Distribution
  const plans = [
    { name: "Enterprise", count: properties.filter((p) => p.plan === "Enterprise").length, mrr: properties.filter((p) => p.plan === "Enterprise").reduce((acc, curr) => acc + curr.mrr, 0), badge: "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800" },
    { name: "Pro", count: properties.filter((p) => p.plan === "Pro").length, mrr: properties.filter((p) => p.plan === "Pro").reduce((acc, curr) => acc + curr.mrr, 0), badge: "bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800" },
    { name: "Starter", count: properties.filter((p) => p.plan === "Starter").length, mrr: properties.filter((p) => p.plan === "Starter").reduce((acc, curr) => acc + curr.mrr, 0), badge: "bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700" },
    { name: "Demo", count: properties.filter((p) => p.plan === "Demo").length, mrr: 0, badge: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800" },
  ];

  const totalMRR = properties.reduce((acc, curr) => acc + curr.mrr, 0) || 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Donut Chart Status */}
      <Card className="p-5 border border-slate-200/80 dark:border-zinc-800">
        <div className="pb-3 border-b border-slate-100 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
            Distribución por Estado
          </p>
          <p className="text-base font-semibold text-slate-900 dark:text-zinc-100 mt-0.5">
            {total} copropiedades registradas
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-6">
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="currentColor" className="text-slate-100 dark:text-zinc-800" strokeWidth="5" />
              {donutSegments.map((seg, idx) => (
                <circle
                  key={idx}
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="5"
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  className="transition-all duration-500"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold text-slate-900 dark:text-zinc-100">{activeCount}</span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium uppercase">Activos</span>
            </div>
          </div>

          <div className="flex-1 space-y-2.5">
            {statusSegments.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                  <span className="text-slate-600 dark:text-zinc-300 font-medium">{s.label}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-zinc-200">
                  <span>{s.count}</span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal">({s.percent}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Plan Tier Bar Distribution */}
      <Card className="p-5 border border-slate-200/80 dark:border-zinc-800">
        <div className="pb-3 border-b border-slate-100 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
            Suscripciones por Plan Comercial
          </p>
          <p className="text-base font-semibold text-slate-900 dark:text-zinc-100 mt-0.5">
            Aporte al MRR Global
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {plans.map((p, idx) => {
            const mrrShare = Math.round((p.mrr / totalMRR) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${p.badge}`}>
                      {p.name}
                    </span>
                    <span className="text-slate-500 dark:text-zinc-400">{p.count} copropiedades</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-zinc-100">{formatCOP(p.mrr)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(mrrShare, p.count > 0 ? 8 : 0)}%`,
                      backgroundColor: "var(--accent-color)"
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
