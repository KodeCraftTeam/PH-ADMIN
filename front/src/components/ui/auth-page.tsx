"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AtSignIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";
import {
  AuthSeparator,
  AuthShell,
  Field,
  GoogleIcon,
} from "./auth-shell";
import { ApiError, API_URL } from "@/lib/http-client";
import { login } from "@/features/auth/api/login.api";
import { setSession } from "@/features/auth/model/session";

const DASHBOARD_BY_ROLE = {
  ADMIN: "/admin",
  SUPER_ADMIN: "/superadmin",
} as const;

export function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState(() => {
    switch (searchParams.get("reason")) {
      case "expired":
        return "Tu sesión expiró. Volvé a iniciar sesión.";
      case "unauthorized":
        return "Iniciá sesión para continuar.";
      default:
        return "";
    }
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completá email y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const session = await login(email, password);
      setSession(session);
      router.push(DASHBOARD_BY_ROLE[session.role]);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No pudimos iniciar sesión. Intentá de nuevo."
      );
      setLoading(false);
    }
  }

  return (
    <AuthShell
      quote={
        <>
          Pasamos de planillas sueltas a tener toda la propiedad horizontal
          ordenada{" "}
          <span className="relative whitespace-nowrap">
            en un solo lugar
            <span
              className="absolute inset-x-0 -bottom-0.5 h-px opacity-70"
              style={{ backgroundColor: "var(--accent-color)" }}
            />
          </span>
          .
        </>
      }
      author="Edificio Aurora"
      authorMeta="120 unidades · Bogotá"
      stats={[
        { value: "1.2k", label: "Unidades activas" },
        { value: "98%", label: "Recaudo al día" },
        { value: "24/7", label: "Acceso al panel" },
      ]}
    >
      <header
        className="ph-rise mb-8 space-y-2"
        style={{ "--ph-delay": "0.1s" } as React.CSSProperties}
      >
        <h1 className="text-[2rem] leading-tight font-semibold tracking-tight">
          Bienvenido de vuelta
        </h1>
        <p className="text-muted-foreground">
          Ingresá a tu panel de administración.
        </p>
      </header>

      <div
        className="ph-rise"
        style={{ "--ph-delay": "0.18s" } as React.CSSProperties}
      >
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-11 w-full font-normal transition-transform active:scale-[.99]"
          onClick={() => {
            window.location.href = `${API_URL}/auth/google`;
          }}
        >
          <GoogleIcon className="me-2.5 size-4" />
          Continuar con Google
        </Button>

        <AuthSeparator label="o con tu email" />
      </div>

      <form
        className="ph-rise space-y-3"
        onSubmit={handleSubmit}
        noValidate
        style={{ "--ph-delay": "0.26s" } as React.CSSProperties}
      >
        <Field icon={<AtSignIcon className="size-4" />}>
          <Input
            placeholder="tu.email@ejemplo.com"
            className="peer h-11 ps-10"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field icon={<LockIcon className="size-4" />}>
          <Input
            placeholder="Contraseña"
            className="peer h-11 ps-10 pe-10"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-muted-foreground hover:text-foreground absolute inset-y-0 end-0 flex items-center pe-3.5 transition-colors"
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
        </Field>

        <div className="flex justify-end pb-1">
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:text-foreground text-xs transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {error && (
          <p
            className="text-destructive bg-destructive/8 rounded-md px-3 py-2 text-sm"
            role="alert"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full transition-transform active:scale-[.99]"
          disabled={loading}
        >
          {loading && <Loader2Icon className="me-2 size-4 animate-spin" />}
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </Button>
      </form>

      <p
        className="ph-rise text-muted-foreground mt-8 flex items-center justify-center gap-1.5 text-center text-sm"
        style={{ "--ph-delay": "0.34s" } as React.CSSProperties}
      >
        <ShieldCheckIcon className="size-3.5" />
        ¿No tenés cuenta?{" "}
        <Link
          href="/register"
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          Registrate
        </Link>
      </p>
    </AuthShell>
  );
}
