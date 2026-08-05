"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AtSignIcon,
  Building2,
  ChevronLeftIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
} from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completá email y contraseña.");
      return;
    }

    setLoading(true);
    // TODO(front): conectar a POST /auth/login cuando el cliente API esté listo.
    window.setTimeout(() => setLoading(false), 900);
  }

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <div className="bg-muted/60 relative hidden h-full flex-col border-r p-10 lg:flex">
        <div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
        <Link href="/" className="z-10 flex items-center gap-2">
          <Building2 className="size-6" />
          <p className="text-xl font-semibold">KodeCraft PH</p>
        </Link>
        <div className="z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl">
              &ldquo;Pasamos de planillas sueltas a tener toda la propiedad
              horizontal ordenada en un solo lugar.&rdquo;
            </p>
            <footer className="font-mono text-sm font-semibold">
              ~ Administración Edificio Aurora
            </footer>
          </blockquote>
        </div>
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>

      <div className="relative flex min-h-screen flex-col justify-center p-4">
        <div
          aria-hidden
          className="absolute inset-0 isolate contain-strict -z-10 opacity-60"
        >
          <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full" />
        </div>

        <Button variant="ghost" className="absolute top-7 left-5" asChild>
          <Link href="/">
            <ChevronLeftIcon className="size-4 me-2" />
            Inicio
          </Link>
        </Button>

        <div className="absolute top-7 right-5">
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full space-y-6 sm:w-sm">
          <div className="flex items-center gap-2 lg:hidden">
            <Building2 className="size-6" />
            <p className="text-xl font-semibold">KodeCraft PH</p>
          </div>

          <div className="flex flex-col space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Iniciar sesión
            </h1>
            <p className="text-muted-foreground text-base">
              Ingresá con tu cuenta para administrar tu propiedad horizontal.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <div className="relative h-max">
                <Input
                  placeholder="tu.email@ejemplo.com"
                  className="peer ps-9"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <AtSignIcon className="size-4" aria-hidden="true" />
                </div>
              </div>

              <div className="relative h-max">
                <Input
                  placeholder="Contraseña"
                  className="peer ps-9 pe-9"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <LockIcon className="size-4" aria-hidden="true" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-muted-foreground hover:text-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 transition-colors"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </button>
              </div>

              <div className="flex justify-end">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary text-xs underline underline-offset-4"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {error && (
              <p className="text-destructive text-sm" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading && <Loader2Icon className="size-4 me-2 animate-spin" />}
              <span>{loading ? "Ingresando..." : "Iniciar sesión"}</span>
            </Button>
          </form>

          <p className="text-muted-foreground text-sm">
            ¿No tenés cuenta?{" "}
            <span className="text-foreground">
              Contactá a tu administrador para que te dé acceso.
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}

const FloatingPaths = React.memo(function FloatingPaths({
  position,
}: {
  position: number;
}) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
          />
        ))}
      </svg>
    </div>
  );
});
