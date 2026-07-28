"use client";

import { Button } from "@/components/ui";
import { useWizardDispatch, useWizardState } from "../model/WizardContext";

export function StepFooter({
  canAdvance = true,
  nextLabel = "Siguiente",
  onAdvance,
}: {
  canAdvance?: boolean;
  nextLabel?: string;
  onAdvance?: () => boolean; // return false to block advancing (e.g. validation)
}) {
  const { step } = useWizardState();
  const dispatch = useWizardDispatch();

  function handleNext() {
    if (onAdvance && !onAdvance()) return;
    dispatch({ type: "NEXT" });
  }

  return (
    <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
      <Button
        variant="secondary"
        onClick={() => dispatch({ type: "BACK" })}
        disabled={step === 1}
      >
        ← Anterior
      </Button>
      <Button onClick={handleNext} disabled={!canAdvance}>
        {nextLabel} →
      </Button>
    </div>
  );
}
