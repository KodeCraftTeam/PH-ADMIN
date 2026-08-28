"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { useWizardDispatch, useWizardState } from "../model/WizardContext";

export function StepFooter({
  canAdvance = true,
  nextLabel = "Siguiente",
  onAdvance,
}: {
  canAdvance?: boolean;
  nextLabel?: string;
  onAdvance?: () => boolean | Promise<boolean>; // retorna false para bloquear el avance (ej. validación)
}) {
  const { step } = useWizardState();
  const dispatch = useWizardDispatch();
  const [pending, setPending] = useState(false);

  async function handleNext() {
    if (onAdvance) {
      setPending(true);
      try {
        if (!(await onAdvance())) return;
      } finally {
        setPending(false);
      }
    }
    dispatch({ type: "NEXT" });
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-zinc-800 pt-6">
      <Button
        variant="secondary"
        onClick={() => dispatch({ type: "BACK" })}
        disabled={step === 1}
      >
        ← Anterior
      </Button>
      <Button onClick={handleNext} disabled={!canAdvance || pending}>
        {pending ? "Procesando…" : `${nextLabel} →`}
      </Button>
    </div>
  );
}
