"use client";

import { cn, IconCheck } from "@/components/ui";
import { useWizardState } from "../model/WizardContext";

const STEPS = [
  "Datos del conjunto",
  "Estructura",
  "Importar unidades",
  "Validación",
  "Cartera inicial",
  "Revisión y activación",
];

export function ProgressBar() {
  const { step, completedSteps } = useWizardState();

  return (
    <div className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-4">
        <ol className="flex items-center">
          {STEPS.map((name, i) => {
            const number = i + 1;
            const completed = completedSteps.includes(number) && number !== step;
            const current = number === step;
            return (
              <li key={name} className="flex flex-1 items-center last:flex-none">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                      completed && "bg-ph-600 text-white",
                      current && "bg-ph-700 text-white ring-4 ring-ph-100",
                      !completed &&
                        !current &&
                        "border border-slate-300 bg-white text-slate-400"
                    )}
                  >
                    {completed ? <IconCheck /> : number}
                  </span>
                  <span
                    className={cn(
                      "hidden whitespace-nowrap text-xs font-medium lg:block",
                      current
                        ? "text-ph-800"
                        : completed
                          ? "text-ph-700"
                          : "text-slate-400"
                    )}
                  >
                    {name}
                  </span>
                </div>
                {number < STEPS.length && (
                  <div
                    className={cn(
                      "mx-3 h-px flex-1",
                      completed ? "bg-ph-500" : "bg-slate-200"
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
