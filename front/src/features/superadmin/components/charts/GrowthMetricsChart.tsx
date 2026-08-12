"use client";

import { useState } from "react";
import { Card, IconBuilding, IconTrendingUp } from "@/components/ui";

interface MonthlyGrowth {
  month: string;
  newProperties: number;
  demosConverted: number;
}

const GROWTH_DATA: MonthlyGrowth[] = [
  { month: "Feb", newProperties: 2, demosConverted: 1 },
  { month: "Mar", newProperties: 1, demosConverted: 1 },
  { month: "Abr", newProperties: 2, demosConverted: 2 },
  { month: "May", newProperties: 2, demosConverted: 1 },
  { month: "Jun", newProperties: 2, demosConverted: 2 },
  { month: "Jul", newProperties: 3, demosConverted: 2 },
];

export function GrowthMetricsChart() {
  const [hovered, setHovered] = useState<MonthlyGrowth | null>(null);

  const maxVal = Math.max(...GROWTH_DATA.map((d) => d.newProperties)) * 1.2;

  return (
    <Card className="p-5 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
                Adquisición de Copropiedades
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 text-xs font-medium text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                <IconBuilding className="h-3.5 w-3.5" /> +3 este mes
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              12 Copropiedades <span className="text-xs font-normal text-slate-400 dark:text-zinc-500">acumuladas</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500"></span>
              <span>Nuevos Contratos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-sky-400"></span>
              <span>Demos Convertidos</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="mt-6">
          <div className="grid grid-cols-6 items-end gap-3 h-36 border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            {GROWTH_DATA.map((item) => {
              const heightPct = (item.newProperties / maxVal) * 100;
              const demoPct = (item.demosConverted / maxVal) * 100;
              const isHovered = hovered?.month === item.month;

              return (
                <div
                  key={item.month}
                  onMouseEnter={() => setHovered(item)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex flex-col items-center gap-1 h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-10 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-2.5 py-1 rounded-md text-[10px] font-bold shadow-lg z-20 whitespace-nowrap animate-pop-in">
                      +{item.newProperties} nuevos ({item.demosConverted} demos)
                    </div>
                  )}

                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Primary Bar */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-1/2 bg-emerald-500 hover:bg-emerald-400 rounded-t-md transition-all duration-300 shadow-xs"
                    ></div>

                    {/* Secondary Bar */}
                    <div
                      style={{ height: `${demoPct}%` }}
                      className="w-1/2 bg-sky-500 hover:bg-sky-400 rounded-t-md transition-all duration-300 shadow-xs"
                    ></div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 group-hover:text-slate-900 dark:group-hover:text-zinc-100 transition-colors">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
        <span>Tasa de Conversión de Demos: <strong className="text-slate-800 dark:text-zinc-200">83.3%</strong></span>
        <span>Velocidad de Cierre: <strong className="text-slate-800 dark:text-zinc-200">4.2 días</strong></span>
      </div>
    </Card>
  );
}
