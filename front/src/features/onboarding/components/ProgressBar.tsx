"use client";

import { cn, IconCheck } from "@/components/ui";
import { useWizardState } from "../model/WizardContext";

const STEPS = [
  "Datos del conjunto",
  "Importar unidades",
  "Validación",
  "Coeficientes",
  "Cartera inicial",
  "Revisión y activación",
];

export function ProgressBar() {
  const { step, completedSteps } = useWizardState();
  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3.5">
        {/* Riel de puntos: ancho fijo, nunca desborda ni necesita scroll */}
        <ol className="flex items-center">
          {STEPS.map((name, i) => {
            const number = i + 1;
            const completed = completedSteps.includes(number) && number !== step;
            const current = number === step;
            return (
              <li key={name} className="flex flex-1 items-center last:flex-none">
                <span
                  className={cn(
                    "flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full text-[11px] sm:text-xs font-semibold transition-colors",
                    completed && "bg-ph-600 dark:bg-ph-300 text-white dark:text-zinc-900",
                    current && "bg-ph-700 dark:bg-zinc-100 text-white dark:text-zinc-900 ring-4 ring-ph-100 dark:ring-zinc-700",
                    !completed &&
                      !current &&
                      "border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-400 dark:text-zinc-500"
                  )}
                  title={name}
                >
                  {completed ? <IconCheck className="h-3.5 w-3.5" /> : number}
                </span>
                {number < STEPS.length && (
                  <div
                    className={cn(
                      "mx-1.5 sm:mx-2 h-px flex-1",
                      completed ? "bg-ph-500 dark:bg-ph-300" : "bg-slate-200 dark:bg-zinc-800"
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>

        {/* Paso actual: siempre visible, sin importar el ancho de pantalla */}
        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-1 flex-1 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-ph-600 dark:bg-ph-300 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="shrink-0 text-[11px] sm:text-xs font-medium text-slate-500 dark:text-zinc-400 whitespace-nowrap">
            Paso {step} de {STEPS.length} · <span className="text-slate-800 dark:text-zinc-100 font-semibold">{STEPS[step - 1]}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
