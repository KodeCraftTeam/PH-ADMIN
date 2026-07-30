"use client";

import { Alert, Badge, Button, IconBuilding, IconX } from "@/components/ui";
import { type PlatformProperty } from "../model/mocks";
import { formatCOP } from "./charts/RevenueTrendChart";

interface Props {
  property: PlatformProperty | null;
  onClose: () => void;
  onResendInvite: (email: string) => void;
}

export function PropertyDetailModal({ property, onClose, onResendInvite }: Props) {
  if (!property) return null;

  const planBadgeTone =
    property.plan === "Enterprise"
      ? "purple"
      : property.plan === "Pro"
      ? "blue"
      : property.plan === "Starter"
      ? "gray"
      : "amber";

  const statusTone =
    property.status === "Activo"
      ? "green"
      : property.status === "En onboarding"
      ? "blue"
      : property.status === "Demo (Prueba)"
      ? "amber"
      : "gray";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-zinc-950/80 p-4 backdrop-blur-xs animate-pop-in">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-slate-100 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm">
              <IconBuilding className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">{property.name}</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">{property.city} • ID: {property.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        {/* Commercial Overview Cards */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 p-3.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
              Estado Comercial
            </span>
            <div className="mt-1.5">
              <Badge tone={statusTone}>{property.status}</Badge>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 p-3.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
              Plan Suscripción
            </span>
            <div className="mt-1.5">
              <Badge tone={planBadgeTone}>{property.plan}</Badge>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 p-3.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
              MRR COP
            </span>
            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-zinc-100">{formatCOP(property.mrr)}</p>
          </div>
        </div>

        {/* Admin Contact Details */}
        <div className="mt-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400 mb-3">
            Datos del Administrador Asignado
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-400 dark:text-zinc-500">Nombre completo</p>
              <p className="font-semibold text-slate-800 dark:text-zinc-200">{property.adminName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-zinc-500">Correo electrónico</p>
              <p className="font-medium text-slate-800 dark:text-zinc-200">{property.adminEmail}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-zinc-500">Teléfono directo</p>
              <p className="font-medium text-slate-700 dark:text-zinc-300">{property.adminPhone}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-zinc-500">Ejecutivo Comercial</p>
              <p className="font-medium text-slate-700 dark:text-zinc-300">{property.salesRepresentative}</p>
            </div>
          </div>
        </div>

        {/* Operational Specs */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 p-3">
            <p className="text-slate-400 dark:text-zinc-500 font-medium">Unidades Registradas</p>
            <p className="mt-1 text-base font-bold text-slate-800 dark:text-zinc-200">
              {property.units ? `${property.units} unidades` : "En proceso de carga"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 p-3">
            <p className="text-slate-400 dark:text-zinc-500 font-medium">Última Actividad Registrada</p>
            <p className="mt-1 text-base font-bold text-slate-800 dark:text-zinc-200">{property.lastActivity}</p>
          </div>
        </div>

        {/* Notes */}
        {property.notes && (
          <div className="mt-4">
            <Alert tone="blue" title="Notas del cliente">
              {property.notes}
            </Alert>
          </div>
        )}

        {/* Actions Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
          <div className="flex gap-2">
            {property.status === "Invitación enviada" && (
              <Button
                variant="secondary"
                onClick={() => {
                  onResendInvite(property.adminEmail);
                  onClose();
                }}
              >
                Reenviar invitación
              </Button>
            )}
            <a
              href="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Simular Onboarding
            </a>
          </div>

          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
}
