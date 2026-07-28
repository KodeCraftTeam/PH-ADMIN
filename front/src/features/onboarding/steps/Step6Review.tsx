"use client";

import { Button, Card, IconCheck } from "@/components/ui";
import { SuccessScreen } from "../components/SuccessScreen";
import { useWizardDispatch, useWizardState } from "../model/WizardContext";

function SummaryCard({
  title,
  detail,
  step,
  onEdit,
}: {
  title: string;
  detail: string;
  step: number;
  onEdit: (step: number) => void;
}) {
  return (
    <Card className="flex items-start justify-between p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <IconCheck />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-0.5 text-sm text-slate-500">{detail}</p>
        </div>
      </div>
      <button
        onClick={() => onEdit(step)}
        className="text-sm font-medium text-ph-700 hover:underline"
      >
        Editar
      </button>
    </Card>
  );
}

export function Step6Review() {
  const state = useWizardState();
  const dispatch = useWizardDispatch();
  const { property, structure, units, balance, activated } = state;

  if (activated) return <SuccessScreen />;

  const totalUnits = structure.reduce((a, f) => a + f.totalUnits, 0);
  const withBalance = balance.filter((c) => c.initialBalance > 0).length;

  function goTo(step: number) {
    dispatch({ type: "GO_TO_STEP", step });
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Revisión y activación</h1>
      <p className="mt-1 text-sm text-slate-500">
        Último vistazo antes de activar. Puedes volver a cualquier paso sin perder lo
        que ya cargaste.
      </p>

      <div className="mt-6 space-y-3">
        <SummaryCard
          title="Datos del conjunto"
          detail={`${property.name || "Sin nombre"} · NIT ${property.taxId} · ${property.city} · Admin: ${property.adminName}`}
          step={1}
          onEdit={goTo}
        />
        <SummaryCard
          title="Estructura"
          detail={`${structure.length} torres/bloques · ${totalUnits} unidades definidas`}
          step={2}
          onEdit={goTo}
        />
        <SummaryCard
          title="Unidades importadas"
          detail={`${units.length} unidades · 100% validadas · coeficientes suman 100.00%`}
          step={4}
          onEdit={goTo}
        />
        <SummaryCard
          title="Cartera inicial"
          detail={`${balance.length} unidades cargadas · ${withBalance} con saldo pendiente · corte 30 jun 2026`}
          step={5}
          onEdit={goTo}
        />
      </div>

      <div className="mt-10 flex flex-col items-center">
        <Button
          className="!px-10 !py-3.5 !text-base"
          onClick={() => dispatch({ type: "ACTIVATE_PROPERTY" })}
        >
          Activar conjunto
        </Button>
        <p className="mt-3 text-xs text-slate-400">
          Al activar, los residentes recibirán su invitación por correo.
        </p>
        <button
          onClick={() => dispatch({ type: "BACK" })}
          className="mt-6 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Volver al paso anterior
        </button>
      </div>
    </div>
  );
}
