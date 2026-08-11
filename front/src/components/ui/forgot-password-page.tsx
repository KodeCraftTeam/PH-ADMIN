"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, KeyRoundIcon, Loader2Icon, MailCheckIcon, MailIcon } from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";
import { AuthShell, Field, GoogleIcon } from "./auth-shell";
import { ApiError, API_URL } from "@/lib/http-client";
import { requestPasswordReset } from "@/features/auth/api/password-reset.api";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Ingresa el correo asociado a tu cuenta.");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No pudimos procesar la solicitud. Intenta de nuevo en unos minutos."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      quote={
        <>
          Tu propiedad horizontal siempre puede volver a estar
          <span className="relative whitespace-nowrap">
            bajo control
            <span
              className="absolute inset-x-0 -bottom-0.5 h-px opacity-70"
              style={{ backgroundColor: "var(--accent-color)" }}
            />
          </span>
          .
        </>
      }
      author="KoreCraft PH"
      authorMeta="Acceso seguro para tu administración"
      stats={[
        { value: "1 paso", label: "Para recuperar el acceso" },
        { value: "Seguro", label: "Enlace privado por correo" },
        { value: "24/7", label: "Tu panel disponible" },
      ]}
    >
      <div className="ph-rise mb-8" style={{ "--ph-delay": "0.1s" } as React.CSSProperties}>
        <Link
          href="/login"
          className="text-muted-foreground hover:text-foreground mb-7 inline-flex items-center text-xs transition-colors"
        >
          <ArrowLeftIcon className="me-1.5 size-3.5" />
          Volver a iniciar sesión
        </Link>

        <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm">
          {submitted ? <MailCheckIcon className="size-5" /> : <KeyRoundIcon className="size-5" />}
        </div>
        <h1 className="text-[2rem] leading-tight font-semibold tracking-tight">
          {submitted ? "Revisa tu correo" : "Recupera tu acceso"}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
          {submitted
            ? `Si existe una cuenta asociada a ${email}, recibirás un enlace para crear una nueva contraseña.`
            : "Ingresa tu correo y te enviaremos un enlace seguro para restablecer tu contraseña."}
        </p>
      </div>

      {submitted ? (
        <div className="ph-rise space-y-5" style={{ "--ph-delay": "0.18s" } as React.CSSProperties}>
          <div className="border-border bg-muted/40 flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed">
            <MailIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <p className="text-muted-foreground">
              Revisa también la carpeta de spam. El enlace tendrá una vigencia limitada por seguridad.
            </p>
          </div>
          <Button asChild size="lg" className="h-11 w-full">
            <Link href="/login">Volver a iniciar sesión</Link>
          </Button>
          <div className="my-1 flex items-center gap-3">
            <div className="bg-border h-px flex-1" />
            <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.14em]">o continúa con</span>
            <div className="bg-border h-px flex-1" />
          </div>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 w-full font-normal"
            onClick={() => {
              window.location.href = `${API_URL}/auth/google`;
            }}
          >
            <GoogleIcon className="me-2.5 size-4" />
            Continuar con Google
          </Button>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground w-full text-center text-xs transition-colors"
            onClick={() => setSubmitted(false)}
          >
            Usar otro correo
          </button>
        </div>
      ) : (
        <form
          className="ph-rise space-y-4"
          onSubmit={handleSubmit}
          noValidate
          style={{ "--ph-delay": "0.18s" } as React.CSSProperties}
        >
          <Field icon={<MailIcon className="size-4" />}>
            <Input
              placeholder="tu.email@ejemplo.com"
              className="peer h-11 ps-10 focus-visible:ring-[var(--accent-color)]"
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-label="Correo electrónico"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>

          {error && (
            <p className="text-destructive bg-destructive/8 rounded-md px-3 py-2 text-sm" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="h-11 w-full" disabled={loading}>
            {loading && <Loader2Icon className="me-2 size-4 animate-spin" />}
            {loading ? "Enviando enlace..." : "Enviar enlace de recuperación"}
          </Button>

          <p className="text-muted-foreground pt-2 text-center text-xs leading-relaxed">
            Por seguridad, nunca te pediremos tu contraseña por correo.
          </p>
        </form>
      )}
    </AuthShell>
  );
}
