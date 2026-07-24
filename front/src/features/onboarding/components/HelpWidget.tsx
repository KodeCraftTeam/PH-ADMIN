"use client";

import { useState } from "react";
import { cn, IconX } from "@/components/ui";
import { useWizardState } from "../model/WizardContext";

const HELP_BY_STEP: Record<number, { title: string; tips: string[] }> = {
  1: {
    title: "Datos del conjunto",
    tips: [
      "El NIT aparece en el RUT de la copropiedad.",
      "El número de unidades incluye apartamentos, locales y parqueaderos con coeficiente.",
      "El correo del administrador será el usuario principal de la plataforma.",
    ],
  },
  2: {
    title: "Estructura",
    tips: [
      "Si tu conjunto no tiene torres, usa el tipo \"Único\" con una sola fila.",
      "El total de unidades se calcula automáticamente: pisos × unidades por piso.",
      "La suma debe coincidir con lo declarado en el paso 1 para poder activar.",
    ],
  },
  3: {
    title: "Importar unidades",
    tips: [
      "Descarga la plantilla y no cambies los nombres de las columnas.",
      "Los coeficientes están en el reglamento de propiedad horizontal.",
      "Puedes quitar el archivo y volver a subirlo las veces que necesites.",
    ],
  },
  4: {
    title: "Validación",
    tips: [
      "Cada error indica la fila exacta y cómo corregirlo.",
      "La suma de coeficientes debe dar exactamente 100%.",
      "Si un error persiste después de dos intentos, escríbenos — lo revisamos contigo.",
    ],
  },
  5: {
    title: "Cartera inicial",
    tips: [
      "Usa el saldo a la fecha de corte, no el histórico completo.",
      "Una unidad al día se registra con saldo 0.",
      "Puedes ajustar la cartera con soporte antes de la primera facturación.",
    ],
  },
  6: {
    title: "Revisión y activación",
    tips: [
      "Revisa cada tarjeta; \"Editar\" te lleva al paso sin perder datos.",
      "Al activar se envían las invitaciones a los propietarios.",
      "Podrás seguir editando la información desde el panel de administración.",
    ],
  },
};

export function HelpWidget() {
  const [open, setOpen] = useState(false);
  const { step } = useWizardState();
  const help = HELP_BY_STEP[step] ?? HELP_BY_STEP[1];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 rounded-xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-900/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Ayuda — paso {step}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-900">
                {help.title}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              aria-label="Cerrar ayuda"
            >
              <IconX />
            </button>
          </div>
          <ul className="mt-3 space-y-2.5">
            {help.tips.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm text-zinc-600">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ph-500" />
                {tip}
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-zinc-100 pt-3">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-sm font-medium text-ph-600 hover:text-ph-700"
            >
              Hablar con soporte →
            </a>
            <p className="mt-1 text-xs text-zinc-400">
              Respondemos en menos de 10 minutos en horario hábil.
            </p>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold shadow-lg transition-colors",
          open
            ? "bg-zinc-800 text-white hover:bg-zinc-700"
            : "bg-ph-600 text-white shadow-ph-600/25 hover:bg-ph-700"
        )}
        aria-label="Abrir ayuda"
      >
        {open ? <IconX className="h-5 w-5" /> : "?"}
      </button>
    </div>
  );
}
