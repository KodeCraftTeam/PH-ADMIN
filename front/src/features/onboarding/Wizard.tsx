"use client";

import { IconBuilding } from "@/components/ui";
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
      <div className="min-h-screen">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ph-700 text-white">
              <IconBuilding />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">KodeCraft PH</p>
              <p className="text-xs text-slate-400">
                Configuración inicial del conjunto
              </p>
            </div>
            <span className="ml-auto text-xs text-slate-400">
              ¿Necesitas ayuda?{" "}
              <a href="#" className="font-medium text-ph-700 hover:underline">
                Habla con soporte
              </a>
            </span>
          </div>
        </header>

        <ProgressBar />

        <main className="mx-auto max-w-5xl px-6 py-8">
          <CurrentStep />
        </main>

        <HelpWidget />
      </div>
    </WizardProvider>
  );
}
