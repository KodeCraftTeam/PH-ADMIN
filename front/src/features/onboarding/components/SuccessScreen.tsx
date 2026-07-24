"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button, IconCheck } from "@/components/ui";
import { useWizardState } from "../model/WizardContext";

const COLORS = ["#18181b", "#71717a", "#d4d4d8", "#10b981", "#f59e0b", "#a1a1aa"];

function Confetti() {
  // 60 pieces with random position/duration/delay, stable across re-renders
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        duration: 3 + Math.random() * 2.5,
        color: COLORS[i % COLORS.length],
        rotation: Math.random() * 360,
        width: 6 + Math.random() * 6,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 block animate-confetti-fall rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.width,
            height: p.width * 0.45,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function SuccessScreen() {
  const { property, units } = useWizardState();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center py-16 text-center">
      <Confetti />
      <div className="animate-pop-in flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
        <IconCheck className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">
        ¡Tu conjunto está listo!
      </h1>
      <p className="mt-3 max-w-md text-slate-500">
        <strong>{property.name || "Tu conjunto"}</strong> quedó activado con{" "}
        {units.length} unidades configuradas. Los propietarios recibirán su
        invitación a la plataforma en los próximos minutos.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={() => router.push("/admin")}>
          Ir al panel de administración
        </Button>
        <Button variant="secondary" onClick={() => router.push("/superadmin")}>
          Volver a super administración
        </Button>
      </div>
    </div>
  );
}
