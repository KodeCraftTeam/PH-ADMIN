"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IconBuilding } from "@/components/ui";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { HelpWidget } from "./components/HelpWidget";
import { ProgressBar } from "./components/ProgressBar";
import { WizardProvider, useWizardState } from "./model/WizardContext";
import { Step1PropertyData } from "./steps/Step1PropertyData";
import { Step2Structure } from "./steps/Step2Structure";
import { Step3ImportUnits } from "./steps/Step3ImportUnits";
import { Step4Validation } from "./steps/Step4Validation";
import { Step5InitialBalance } from "./steps/Step5InitialBalance";
import { Step6Review } from "./steps/Step6Review";

function CurrentStep() {
  const { step } = useWizardState();
  switch (step) {
    case 1:
      return <Step1PropertyData />;
    case 2:
      return <Step2Structure />;
    case 3:
      return <Step3ImportUnits />;
    case 4:
      return <Step4Validation />;
    case 5:
      return <Step5InitialBalance />;
    case 6:
      return <Step6Review />;
    default:
      return null;
  }
}

export function Wizard() {
  return (
    <WizardProvider>
      <div className="min-h-screen bg-slate-50/70 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors flex flex-col">
        {/* Sticky Header Bar with Back Button */}
        <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md transition-colors h-14 w-full flex-shrink-0">
          <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                title="Volver a Mis Copropiedades"
                aria-label="Volver a Mis Copropiedades"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200/80 dark:border-zinc-700/80 transition-all shadow-xs cursor-pointer group shrink-0"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-150" />
              </Link>

              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-zinc-800">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs shadow-xs">
                  <IconBuilding />
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                    Nueva Copropiedad
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-400">
                    Registro paso a paso
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <span className="text-xs text-slate-400 dark:text-zinc-400 hidden md:inline">
                ¿Necesitas ayuda?{" "}
                <a
                  href="#"
                  className="font-medium text-slate-800 dark:text-zinc-200 hover:underline"
                >
                  Soporte
                </a>
              </span>
            </div>
          </div>
        </header>

        <ProgressBar />

        <main className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-6 sm:py-8 flex-1">
          <CurrentStep />
        </main>

        <HelpWidget />
      </div>
    </WizardProvider>
  );
}
