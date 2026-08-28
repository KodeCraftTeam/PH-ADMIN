"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, IconCheck, IconX, toast } from "@/components/ui";
import { SuccessScreen } from "../components/SuccessScreen";
import { useWizardDispatch, useWizardState } from "../model/WizardContext";
import { activateProperty, getOnboardingStatus } from "../api/onboarding.api";
import { ApiError } from "@/lib/http-client";

function SummaryCard({
  title,
  detail,
  step,
  ok,
  onEdit,
}: {
  title: string;
  detail: string;
  step: number;
  ok: boolean;
  onEdit: (step: number) => void;
}) {
  return (
    <Card className="flex items-start justify-between p-5">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            ok
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
          }`}
        >
          {ok ? <IconCheck /> : <IconX />}
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{title}</p>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-zinc-400">{detail}</p>
        </div>
      </div>
      <button
        onClick={() => onEdit(step)}
        className="text-sm font-medium text-ph-700 dark:text-zinc-200 hover:underline shrink-0 ml-3"
      >
        Editar
      </button>
    </Card>
  );
}

export function Step6Review() {
  const state = useWizardState();
  const dispatch = useWizardDispatch();
  const { propertyId, property, importPreview, status, activated } = state;
  const [loadingStatus, setLoadingStatus] = useState(() => !!propertyId);
  const [activating, setActivating] = useState(false);
  const [activateError, setActivateError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) return;
    let cancelled = false;
    getOnboardingStatus(propertyId)
      .then((result) => {
        if (cancelled) return;
        dispatch({ type: "SET_STATUS", status: result });
      })
      .catch(() => {
        // se muestra igual con lo último que se tenga en memoria
      })
      .finally(() => {
        if (!cancelled) setLoadingStatus(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  if (activated) return <SuccessScreen />;

  function goTo(step: number) {
    dispatch({ type: "GO_TO_STEP", step });
  }

  async function handleActivate() {
    if (!propertyId) return;
    setActivateError(null);
    setActivating(true);
    try {
      await activateProperty(propertyId);
      toast.success(
        "¡Copropiedad activada!",
        "El conjunto ha sido configurado y activado satisfactoriamente."
      );
      dispatch({ type: "ACTIVATE_PROPERTY" });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "No se pudo activar el conjunto.";
      setActivateError(message);
      toast.error("Error al activar", message);
    } finally {
      setActivating(false);
    }
  }

  const unitsOk = status?.units.complete ?? importPreview?.totalUnits !== undefined;
  const ownersOk = status?.owners.complete ?? false;
  const coefficientsOk = status?.coefficients.complete ?? false;
  const balancesOk = status?.balances.complete ?? false;
  const canActivate = !loadingStatus && !!status?.canActivate;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">Revisión y activación</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
        Último vistazo antes de activar. Puedes volver a cualquier paso sin perder lo
        que ya cargaste.
      </p>

      <div className="mt-6 space-y-3">
        <SummaryCard
          title="Datos del conjunto"
          detail={`${property.name || "Sin nombre"} · NIT ${property.taxId} · ${property.city} · Admin: ${property.adminName}`}
          step={1}
          ok
          onEdit={goTo}
        />
        <SummaryCard
          title="Unidades y propietarios"
          detail={
            status
              ? `${status.units.loaded}/${status.units.declared} unidades cargadas · ${status.owners.withoutOwner} sin propietario`
              : `${importPreview?.totalUnits ?? 0} unidades importadas`
          }
          step={3}
          ok={unitsOk && ownersOk}
          onEdit={goTo}
        />
        <SummaryCard
          title="Coeficientes"
          detail={
            status
              ? `Suma actual: ${status.coefficients.currentSum.toFixed(2)}%`
              : "Aún no se ha confirmado la importación"
          }
          step={4}
          ok={coefficientsOk}
          onEdit={goTo}
        />
        <SummaryCard
          title="Cartera inicial"
          detail={
            status
              ? `${status.balances.loaded}/${status.balances.total} unidades con saldo cargado (opcional)`
              : "Aún no se ha cargado"
          }
          step={5}
          ok={balancesOk}
          onEdit={goTo}
        />
      </div>

      {!loadingStatus && !canActivate && (
        <div className="mt-4">
          <Alert tone="amber" title="Aún no puedes activar el conjunto">
            Unidades, propietarios y coeficientes deben estar completos primero. La
            cartera inicial es opcional y no bloquea la activación.
          </Alert>
        </div>
      )}

      {activateError && (
        <div className="mt-4">
          <Alert tone="red" title="No se pudo activar">
            {activateError}
          </Alert>
        </div>
      )}

      <div className="mt-10 flex flex-col items-center">
        <Button
          className="!px-10 !py-3.5 !text-base"
          onClick={handleActivate}
          disabled={!canActivate || activating}
        >
          {activating ? "Activando…" : "Activar conjunto"}
        </Button>
        <p className="mt-3 text-xs text-slate-400 dark:text-zinc-500">
          Al activar, los residentes recibirán su invitación por correo.
        </p>
        <button
          onClick={() => dispatch({ type: "BACK" })}
          className="mt-6 text-sm font-medium text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200"
        >
          ← Volver al paso anterior
        </button>
      </div>
    </div>
  );
}
