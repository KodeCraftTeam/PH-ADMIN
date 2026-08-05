import { cn } from "@/lib/utils";

/**
 * Fachada de edificio: grilla de ventanas que se encienden en oleadas.
 * Cada ventana es una unidad — el motivo visual de la plataforma.
 *
 * Valores pseudo-aleatorios derivados del índice: Math.random() acá
 * desincroniza SSR y cliente (hydration mismatch).
 *
 * Las luces son cálidas/frías fijas, no var(--accent-color): la fachada
 * vive sobre paneles siempre oscuros y el acento del tema claro (#18181b)
 * quedaría invisible.
 */
function buildWindows(cols: number, rows: number) {
  return Array.from({ length: cols * rows }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const hash = (row * 31 + col * 17 + row * col * 7) % 100;
    return {
      id: i,
      lit: hash > 38,
      warm: hash % 3 !== 0,
      delay: (hash % 24) * 0.45,
      duration: 7 + (hash % 7),
    };
  });
}

export function BuildingFacade({
  cols = 11,
  rows = 16,
  tilt = true,
  sweep = true,
  className,
}: {
  cols?: number;
  rows?: number;
  tilt?: boolean;
  sweep?: boolean;
  className?: string;
}) {
  const windows = buildWindows(cols, rows);

  return (
    <div
      aria-hidden
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="absolute inset-x-[-8%] top-[-6%] bottom-[-14%] grid gap-[0.55rem]"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          transform: tilt
            ? "perspective(1400px) rotateY(-13deg) rotateX(3deg)"
            : undefined,
          transformOrigin: "left center",
        }}
      >
        {windows.map((w) =>
          w.lit ? (
            <div
              key={w.id}
              className="ph-window rounded-[3px]"
              style={
                {
                  backgroundColor: w.warm ? "#ffd9a0" : "#cfe4ff",
                  boxShadow: w.warm
                    ? "0 0 12px 1px rgba(255,196,110,.35)"
                    : "0 0 12px 1px rgba(150,190,255,.3)",
                  "--ph-delay": `${w.delay}s`,
                  "--ph-dur": `${w.duration}s`,
                } as React.CSSProperties
              }
            />
          ) : (
            <div key={w.id} className="rounded-[3px] bg-white/[0.035]" />
          )
        )}
      </div>

      {sweep && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="ph-sweep absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        </div>
      )}
    </div>
  );
}
