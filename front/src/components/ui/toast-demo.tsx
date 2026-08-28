"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { toast } from "./toast";

export function ToastDemoTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleTrigger = (type: "error" | "success" | "warning" | "info") => {
    if (type === "error") {
      toast.error(
        "Error en la operación",
        "No se pudo sincronizar la información con el servidor. Por favor verifica los datos e intenta de nuevo."
      );
    } else if (type === "success") {
      toast.success(
        "¡Operación exitosa!",
        "La copropiedad ha sido guardada y configurada correctamente en el sistema."
      );
    } else if (type === "warning") {
      toast.warning(
        "Atención requerida",
        "Hay 3 unidades con saldo de cartera pendiente de verificación este mes."
      );
    } else if (type === "info") {
      toast.info(
        "Actualización del sistema",
        "Se aplicaron los nuevos coeficientes de copropiedad automáticamente."
      );
    }
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-md transition-all hover:bg-slate-100 hover:text-slate-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800/90 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-white"
        title="Probar notificaciones Toast"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 dark:bg-rose-500/20">
          <Bell className="h-3 w-3" />
        </span>
        <span className="hidden sm:inline">Probar Toast</span>
        <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl animate-pop-in dark:border-zinc-800 dark:bg-zinc-900/95 z-50">
          <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-zinc-800 text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
            Disparar Notificación:
          </div>

          <div className="space-y-1 p-1">
            <button
              type="button"
              onClick={() => handleTrigger("error")}
              className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-200 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 text-left"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="font-semibold leading-none">Toast de Error</p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Alerta roja con barra</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTrigger("success")}
              className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:text-zinc-200 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 text-left"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="font-semibold leading-none">Toast de Éxito</p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Alerta verde completado</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTrigger("warning")}
              className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:text-zinc-200 dark:hover:bg-amber-950/40 dark:hover:text-amber-400 text-left"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="font-semibold leading-none">Toast de Advertencia</p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Alerta ámbar atención</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTrigger("info")}
              className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-600 dark:text-zinc-200 dark:hover:bg-sky-950/40 dark:hover:text-sky-400 text-left"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400">
                <Info className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="font-semibold leading-none">Toast Informativo</p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Alerta azul general</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
