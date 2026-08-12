"use client";

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
      <div className="min-h-screen bg-slate-50/70 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors">
        <header className="border-b border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md transition-colors">
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 sm:px-6 py-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm">
              <IconBuilding />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">KodeCraft PH</p>
              <p className="text-xs text-slate-400 dark:text-zinc-400">
                Configuración inicial del conjunto
              </p>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <ThemeToggle />
              <span className="text-xs text-slate-400 dark:text-zinc-400 hidden sm:inline">
                ¿Necesitas ayuda?{" "}
                <a href="#" className="font-medium text-slate-800 dark:text-zinc-200 hover:underline">
                  Habla con soporte
                </a>
              </span>
            </div>
          </div>
        </header>

        <ProgressBar />

        <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
          <CurrentStep />
        </main>

        <HelpWidget />
      </div>
    </WizardProvider>
  );
}
