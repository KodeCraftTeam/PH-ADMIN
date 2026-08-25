"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  id?: string;
  title?: string;
  description?: React.ReactNode;
  duration?: number; // Duration in ms. Default: 4500 (6000 for errors). Set to 0 or Infinity for persistent.
  action?: ToastAction;
  onDismiss?: () => void;
}

export interface ToastItem extends ToastOptions {
  id: string;
  type: ToastType;
  title: string;
  createdAt: number;
}

type ToastInput =
  | string
  | (Omit<ToastOptions, "title"> & {
      title?: string;
      description?: React.ReactNode;
    });

// Event listener mechanism for calling toast from outside React tree
type ToastListener = (toasts: ToastItem[]) => void;
let activeToasts: ToastItem[] = [];
const listeners = new Set<ToastListener>();

function notifyListeners() {
  listeners.forEach((listener) => listener([...activeToasts]));
}

function generateId() {
  return `toast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function addToast(type: ToastType, titleOrOptions: ToastInput, extraOptions?: Omit<ToastOptions, "title"> | string) {
  let title = "";
  let options: ToastOptions = {};

  if (typeof titleOrOptions === "string") {
    title = titleOrOptions;
    if (typeof extraOptions === "string") {
      options = { description: extraOptions };
    } else if (extraOptions) {
      options = extraOptions;
    }
  } else {
    title = titleOrOptions.title || "";
    options = titleOrOptions;
  }

  const id = options.id || generateId();
  const duration =
    options.duration !== undefined
      ? options.duration
      : type === "error"
      ? 6000
      : 4500;

  const newToast: ToastItem = {
    id,
    type,
    title,
    description: options.description,
    duration,
    action: options.action,
    onDismiss: options.onDismiss,
    createdAt: Date.now(),
  };

  // Replace if same id, or prepend (newest on top)
  activeToasts = [newToast, ...activeToasts.filter((t) => t.id !== id)].slice(0, 5); // keep max 5 toasts
  notifyListeners();
  return id;
}

export function dismissToast(id: string) {
  const toastToRemove = activeToasts.find((t) => t.id === id);
  if (toastToRemove?.onDismiss) {
    toastToRemove.onDismiss();
  }
  activeToasts = activeToasts.filter((t) => t.id !== id);
  notifyListeners();
}

export const toast = {
  success: (titleOrOptions: ToastInput, extraOptions?: Omit<ToastOptions, "title"> | string) =>
    addToast("success", titleOrOptions, extraOptions),
  error: (titleOrOptions: ToastInput, extraOptions?: Omit<ToastOptions, "title"> | string) =>
    addToast("error", titleOrOptions, extraOptions),
  warning: (titleOrOptions: ToastInput, extraOptions?: Omit<ToastOptions, "title"> | string) =>
    addToast("warning", titleOrOptions, extraOptions),
  info: (titleOrOptions: ToastInput, extraOptions?: Omit<ToastOptions, "title"> | string) =>
    addToast("info", titleOrOptions, extraOptions),
  dismiss: (id: string) => dismissToast(id),
  clear: () => {
    activeToasts = [];
    notifyListeners();
  },
};

const ToastContext = createContext<{
  toast: typeof toast;
  dismiss: (id: string) => void;
}>({
  toast,
  dismiss: dismissToast,
});

export function useToast() {
  return useContext(ToastContext);
}

const TYPE_CONFIG = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-emerald-500 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20 ring-1 ring-emerald-500/25",
    progressBar: "bg-emerald-500 dark:bg-emerald-400",
    borderColor: "border-emerald-500/30 dark:border-emerald-500/30",
    glowColor: "rgba(16, 185, 129, 0.08)",
  },
  error: {
    icon: AlertCircle,
    iconColor: "text-rose-500 dark:text-rose-400",
    iconBg: "bg-rose-500/10 dark:bg-rose-500/20 ring-1 ring-rose-500/25",
    progressBar: "bg-rose-500 dark:bg-rose-400",
    borderColor: "border-rose-500/30 dark:border-rose-500/30",
    glowColor: "rgba(244, 63, 94, 0.08)",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-500 dark:text-amber-400",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20 ring-1 ring-amber-500/25",
    progressBar: "bg-amber-500 dark:bg-amber-400",
    borderColor: "border-amber-500/30 dark:border-amber-500/30",
    glowColor: "rgba(245, 158, 11, 0.08)",
  },
  info: {
    icon: Info,
    iconColor: "text-sky-500 dark:text-sky-400",
    iconBg: "bg-sky-500/10 dark:bg-sky-500/20 ring-1 ring-sky-500/25",
    progressBar: "bg-sky-500 dark:bg-sky-400",
    borderColor: "border-sky-500/30 dark:border-sky-500/30",
    glowColor: "rgba(14, 165, 233, 0.08)",
  },
};

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastCard({ toast: item, onDismiss }: ToastCardProps) {
  const duration = item.duration ?? (item.type === "error" ? 6000 : 4500);
  const isInfinite = duration === 0 || duration === Infinity;

  const [isPaused, setIsPaused] = useState(false);
  const remainingTimeRef = useRef(duration);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isInfinite) return;

    if (!isPaused) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        onDismiss(item.id);
      }, remainingTimeRef.current);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPaused, isInfinite, item.id, onDismiss]);

  const config = TYPE_CONFIG[item.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={{
        opacity: 0,
        x: 30,
        scale: 0.92,
        transition: { duration: 0.22, ease: "easeOut" },
      }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 30,
        mass: 0.8,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
      aria-live="assertive"
      className={`group relative flex w-full max-w-[420px] items-start gap-3 overflow-hidden rounded-2xl border ${config.borderColor} bg-white/95 p-4 shadow-xl backdrop-blur-xl transition-all duration-200 hover:shadow-2xl dark:bg-zinc-900/95 dark:shadow-black/60`}
      style={{
        boxShadow: `0 10px 25px -5px ${config.glowColor}, 0 8px 10px -6px ${config.glowColor}`,
      }}
    >
      {/* Icon Badge */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.iconBg} ${config.iconColor} transition-transform duration-200 group-hover:scale-105`}
      >
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pt-0.5">
        <h4 className="text-sm font-semibold tracking-[-0.01em] text-slate-900 dark:text-zinc-100">
          {item.title}
        </h4>
        {item.description && (
          <div className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
            {item.description}
          </div>
        )}

        {item.action && (
          <button
            type="button"
            onClick={() => {
              item.action?.onClick();
              onDismiss(item.id);
            }}
            className="mt-2.5 inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            {item.action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Cerrar notificación"
        className="shrink-0 rounded-lg p-1 text-slate-400 opacity-70 transition-all duration-150 hover:bg-slate-100 hover:text-slate-700 hover:opacity-100 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Countdown Progress Line Bar at Bottom */}
      {!isInfinite && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-slate-100/90 dark:bg-zinc-800/80 overflow-hidden rounded-b-2xl">
          <div
            className={`h-full ${config.progressBar}`}
            style={{
              width: "100%",
              animationName: "toast-progress",
              animationDuration: `${duration}ms`,
              animationTimingFunction: "linear",
              animationFillMode: "forwards",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    setToasts(activeToasts);
    const listener: ToastListener = (nextToasts) => {
      setToasts(nextToasts);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <div
      aria-label="Notificaciones"
      className="pointer-events-none fixed right-0 top-0 z-[100] flex max-h-screen w-full max-w-[440px] flex-col items-end gap-3 p-4 sm:p-6"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full">
            <ToastCard toast={t} onDismiss={dismissToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastContext.Provider value={{ toast, dismiss: dismissToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}
