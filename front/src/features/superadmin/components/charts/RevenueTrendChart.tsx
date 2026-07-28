"use client";

import { useState } from "react";
import { Card, IconTrendingUp } from "@/components/ui";
import { MRR_HISTORY_MOCK, type MRRHistoryPoint } from "../../model/mocks";

export function formatCOP(val: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(val);
}

export function RevenueTrendChart() {
  const [hoveredPoint, setHoveredPoint] = useState<MRRHistoryPoint | null>(null);

  const data = MRR_HISTORY_MOCK;
  const maxMRR = Math.max(...data.map((d) => d.mrr)) * 1.15;
  const minMRR = 0;

  const width = 500;
  const height = 150;
  const paddingX = 25;
  const paddingY = 20;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartW;
    const y = height - paddingY - ((d.mrr - minMRR) / (maxMRR - minMRR)) * chartH;
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  const growthRate = (((latest.mrr - previous.mrr) / previous.mrr) * 100).toFixed(1);

  return (
    <Card className="p-5 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
                Tendencia de Ingresos MRR
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <IconTrendingUp className="h-3.5 w-3.5" /> +{growthRate}% este mes
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              {formatCOP(latest.mrr)} <span className="text-xs font-normal text-slate-400 dark:text-zinc-500">COP/mes</span>
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <span>Facturado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-zinc-700"></span>
              <span>Meta Q3</span>
            </div>
          </div>
        </div>

        {/* SVG Curve Area Chart */}
        <div className="relative mt-4">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.5, 1].map((ratio, idx) => {
              const y = height - paddingY - ratio * chartH;
              return (
                <line
                  key={idx}
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  className="text-slate-200 dark:text-zinc-800/80"
                  strokeWidth="1"
                />
              );
            })}

            {/* Gradient Area */}
            <path d={areaD} fill="url(#mrrGradient)" />

            {/* Curve Stroke */}
            <path
              d={pathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points */}
            {points.map((pt, i) => {
              const isHovered = hoveredPoint?.month === pt.data.month;
              return (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4}
                    className="fill-white dark:fill-zinc-900 stroke-emerald-500 cursor-pointer transition-all duration-150"
                    strokeWidth="3"
                    onMouseEnter={() => setHoveredPoint(pt.data)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Month Label */}
                  <text
                    x={pt.x}
                    y={height - 2}
                    textAnchor="middle"
                    className="text-[10px] font-semibold fill-slate-400 dark:fill-zinc-500"
                  >
                    {pt.data.month.split(" ")[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip Popover */}
          {hoveredPoint && (
            <div className="absolute top-2 right-2 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-1.5 rounded-lg shadow-xl text-xs font-semibold animate-pop-in z-20">
              <p className="text-[10px] opacity-75">{hoveredPoint.month}</p>
              <p className="text-sm font-bold">{formatCOP(hoveredPoint.mrr)}</p>
              <p className="text-[10px] font-normal">{hoveredPoint.activeProperties} copropiedades activas</p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
        <span>Promedio por Copropiedad: <strong className="text-slate-800 dark:text-zinc-200">$ 1.850.000 COP</strong></span>
        <span>Ticket Promedio Plan Enterprise</span>
      </div>
    </Card>
  );
}
