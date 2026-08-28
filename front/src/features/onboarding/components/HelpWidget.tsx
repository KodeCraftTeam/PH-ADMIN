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
    title: "Importar unidades",
    tips: [
      "Descarga la plantilla y no cambies los nombres de las columnas.",
      "El archivo trae unidades, personas y propietarios en 3 hojas.",
      "Puedes quitar el archivo y volver a subirlo las veces que necesites.",
    ],
  },
  3: {
    title: "Validación",
    tips: [
      "Cada error indica la fila exacta y cómo corregirlo.",
      "Mientras haya errores no se importa nada — corrige y vuelve a subir.",
      "Si un error persiste después de dos intentos, escríbenos — lo revisamos contigo.",
    ],
  },
  4: {
    title: "Coeficientes",
    tips: [
      "Los coeficientes están en el reglamento de propiedad horizontal.",
      "La suma de todas las unidades debe dar exactamente 100%.",
      "Marca \"Reglamento\" cuando el valor venga del documento notarial, no de un cálculo.",
    ],
  },
  5: {
    title: "Cartera inicial",
    tips: [
      "Usa el saldo a la fecha de corte, no el histórico completo.",
      "Una unidad al día se registra con saldo 0.",
      "Este paso es opcional — puedes activar el conjunto y cargarlo después.",
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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[calc(100vw-2rem)] max-w-80 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xl shadow-zinc-900/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                Ayuda — paso {step}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {help.title}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300"
              aria-label="Cerrar ayuda"
            >
              <IconX />
            </button>
          </div>
          <ul className="mt-3 space-y-2.5">
            {help.tips.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ph-500 dark:bg-ph-300" />
                {tip}
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-sm font-medium text-ph-600 dark:text-ph-300 hover:text-ph-700 dark:hover:text-ph-200"
            >
              Hablar con soporte →
            </a>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
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
