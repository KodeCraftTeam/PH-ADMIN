import { Building2 } from "lucide-react";

import { cn } from "@/lib/utils";

/** Marca compartida entre landing y login. */
export function Logo({
  className,
  showName = true,
  invert = false,
}: {
  className?: string;
  showName?: boolean;
  /** Sobre paneles siempre oscuros, donde el acento del tema claro no contrasta. */
  invert?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-xl"
        style={
          invert
            ? { backgroundColor: "#fafafa", color: "#09090b" }
            : {
                backgroundColor: "var(--accent-color)",
                color: "var(--accent-text)",
              }
        }
      >
        <Building2 className="size-5" />
      </span>
      {showName && (
        <span className="text-lg font-semibold tracking-tight">
          KodeCraft PH
        </span>
      )}
    </span>
  );
}
