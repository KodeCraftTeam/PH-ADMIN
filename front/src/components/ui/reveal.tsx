"use client";

import React, { useEffect, useRef, useState } from "react";

type Direction = "left" | "right" | "up" | "zoom";

/**
 * Llama a `onEnter` la primera vez que el elemento entra en viewport.
 *
 * Mide con getBoundingClientRect en vez de IntersectionObserver: el observer
 * no dispara cuando la página no está pintando (pestaña en segundo plano al
 * cargar), y ahí el contenido quedaría oculto para siempre. Un rect siempre
 * se puede calcular. Devuelve la función de limpieza.
 */
function onEnterViewport(el: HTMLElement, onEnter: () => void) {
  let done = false;
  let frame = 0;

  const check = () => {
    frame = 0;
    if (done) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const entered = rect.top < vh * 0.88 && rect.bottom > 0;
    if (entered) {
      done = true;
      cleanup();
      onEnter();
    }
  };

  const schedule = () => {
    if (frame || done) return;
    frame = requestAnimationFrame(check);
  };

  const cleanup = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  check();

  return () => {
    done = true;
    cleanup();
  };
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Revela su contenido al entrar en viewport.
 *
 * El estado oculto lo aplica JS al montar (data-ph-reveal). Sin JS o con
 * reduced-motion el atributo nunca se pone y el contenido queda visible:
 * ocultar desde el CSS base dejaría la página en blanco si algo falla.
 */
export function Reveal({
  children,
  from = "up",
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  from?: Direction;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    el.dataset.phReveal = from;
    return onEnterViewport(el, () => {
      el.dataset.phVisible = "";
    });
  }, [from]);

  return React.createElement(
    Tag,
    {
      ref,
      className,
      style: delay
        ? ({ "--ph-delay": `${delay}s` } as React.CSSProperties)
        : undefined,
    },
    children
  );
}

/**
 * Cuenta hasta `value` al entrar en viewport.
 * Sin JS o con reduced-motion muestra el valor final directamente.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1400,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let raf = 0;
    const stop = onEnterViewport(el, () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        // easeOutExpo
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setShown(value * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      setShown(0);
      raf = requestAnimationFrame(tick);
    });

    return () => {
      stop();
      cancelAnimationFrame(raf);
      // si se desmonta a mitad de la cuenta, dejar el valor real
      setShown(value);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {shown.toLocaleString("es-CO", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
