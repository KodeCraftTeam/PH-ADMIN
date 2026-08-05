"use client";

import React, { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Código de N dígitos en casillas separadas.
 * Auto-avanza al tipear, retrocede con backspace, y acepta pegar el código
 * completo en cualquier casilla.
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  invalid = false,
  autoFocus = false,
}: {
  value: string;
  onChange: (next: string) => void;
  length?: number;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const focusAt = (i: number) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))];
    el?.focus();
    el?.select();
  };

  const writeAt = (i: number, digits: string) => {
    const chars = value.padEnd(length, " ").split("");
    for (let k = 0; k < digits.length && i + k < length; k++) {
      chars[i + k] = digits[k];
    }
    onChange(chars.join("").trimEnd().slice(0, length));
  };

  const handleChange = (i: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return;
    writeAt(i, digits);
    focusAt(i + digits.length);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[i]) {
        // borra el dígito actual
        const chars = value.padEnd(length, " ").split("");
        chars[i] = " ";
        onChange(chars.join("").trimEnd());
      } else {
        // casilla vacía: borra la anterior y retrocede
        const chars = value.padEnd(length, " ").split("");
        chars[i - 1] = " ";
        onChange(chars.join("").trimEnd());
        focusAt(i - 1);
      }
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(i - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(i + 1);
    }
  };

  const handlePaste = (i: number, e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!digits) return;
    e.preventDefault();
    writeAt(i, digits);
    focusAt(i + digits.length);
  };

  return (
    <div className="flex justify-between gap-2" role="group" aria-label="Código de verificación">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          aria-label={`Dígito ${i + 1}`}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => e.target.select()}
          className={cn(
            "border-input bg-background h-13 w-full rounded-xl border text-center text-xl font-semibold tabular-nums",
            "focus-visible:ring-ring transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
            // la clase aparece al llenarse el dígito y eso dispara el pop
            value[i] && "ph-digit-filled border-foreground/30",
            invalid && "border-destructive text-destructive"
          )}
        />
      ))}
    </div>
  );
}
