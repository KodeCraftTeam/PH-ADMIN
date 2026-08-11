"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  KeyRoundIcon,
  Loader2Icon,
  LockKeyholeIcon,
  MailCheckIcon,
  MailIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";
import { OtpInput } from "./otp-input";
import { AuthShell, Field, GoogleIcon } from "./auth-shell";
import { ApiError, API_URL } from "@/lib/http-client";
import {
  requestPasswordReset,
  resetPassword,
  verifyPasswordResetCode,
} from "@/features/auth/api/password-reset.api";

type RecoveryStep = "request" | "verify" | "reset" | "success";

function getErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof ApiError)) return fallback;

  if (error.code === "USER_NOT_FOUND") {
    return "No pudimos encontrar una cuenta con ese correo. Verifica los datos e intenta de nuevo.";
  }

  if (error.code === "EMAIL_DELIVERY_FAILED") {
    return "No pudimos enviar el correo ahora. Intenta de nuevo en unos minutos.";
  }

  if (error.code === "InvalidVerificationCodeError") {
    return "El código no es válido o ya expiró. Solicita uno nuevo e intenta otra vez.";
  }

  return error.message || fallback;
}

export function ForgotPasswordPage() {
  const [step, setStep] = useState<RecoveryStep>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [googleAccount, setGoogleAccount] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function goToRequest() {
    setStep("request");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setGoogleAccount(false);
    setError("");
    setNotice("");
  }

  async function handleRequest(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    setGoogleAccount(false);

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Ingresa el correo asociado a tu cuenta.");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(normalizedEmail);
      setEmail(normalizedEmail);
      setCode("");
      setStep("verify");
    } catch (requestError) {
      if (
        requestError instanceof ApiError &&
        requestError.code === "GOOGLE_ACCOUNT_PASSWORD_RECOVERY"
      ) {
        setGoogleAccount(true);
        setError("Esta cuenta fue creada con Google. Continúa con Google para iniciar sesión.");
      } else {
        setError(getErrorMessage(requestError, "No pudimos procesar la solicitud."));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (code.length !== 6) {
      setError("Ingresa los 6 dígitos que recibiste en tu correo.");
      return;
    }

    setLoading(true);
    try {
      await verifyPasswordResetCode(email, code);
      setStep("reset");
    } catch (verifyError) {
      setError(getErrorMessage(verifyError, "No pudimos validar el código."));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setNotice("");
    setResending(true);

    try {
      await requestPasswordReset(email);
      setCode("");
      setNotice("Te enviamos un código nuevo. Revisa tu correo y la carpeta de spam.");
    } catch (resendError) {
      setError(getErrorMessage(resendError, "No pudimos reenviar el código."));
    } finally {
      setResending(false);
    }
  }

  async function handleResetPassword(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setStep("success");
    } catch (resetError) {
      if (
        resetError instanceof ApiError &&
        resetError.code === "InvalidVerificationCodeError"
      ) {
        setStep("verify");
        setCode("");
      }
      setError(getErrorMessage(resetError, "No pudimos actualizar la contraseña."));
    } finally {
      setLoading(false);
    }
  }

  const heading =
    googleAccount && step === "request"
      ? "Continúa con Google"
      : {
          request: "Recupera tu acceso",
          verify: "Ingresa el código",
          reset: "Crea una nueva contraseña",
          success: "Contraseña actualizada",
        }[step];

  const description =
    googleAccount && step === "request"
      ? "Esta cuenta se creó con Google. Usa el botón para iniciar sesión de forma segura."
      : {
          request: "Ingresa tu correo y te enviaremos un código seguro para restablecer tu contraseña.",
          verify: `Enviamos un código de 6 dígitos a ${email}.`,
          reset: "Elige una contraseña nueva para volver a entrar a tu cuenta.",
          success: "Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión.",
        }[step];

  const passwordLengthValid = newPassword.length >= 8;
  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

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
      author="KodeCraft PH"
      authorMeta="Acceso seguro para tu administración"
      stats={[
        { value: "3 pasos", label: "Para recuperar el acceso" },
        { value: "6 dígitos", label: "Código privado por correo" },
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
          {step === "verify" ? (
            <MailCheckIcon className="size-5" />
          ) : step === "success" ? (
            <CheckCircle2Icon className="size-5" />
          ) : (
            <KeyRoundIcon className="size-5" />
          )}
        </div>
        <h1 className="text-[2rem] leading-tight font-semibold tracking-tight text-balance">
          {heading}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed text-pretty">
          {description}
        </p>
      </div>

      {step === "request" && (
        <form
          className="ph-rise space-y-4"
          onSubmit={handleRequest}
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

          {googleAccount && (
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
          )}

          {!googleAccount && (
            <Button type="submit" size="lg" className="h-11 w-full" disabled={loading}>
              {loading && <Loader2Icon className="me-2 size-4 animate-spin" />}
              {loading ? "Enviando código..." : "Enviar código de recuperación"}
            </Button>
          )}

          <p className="text-muted-foreground pt-2 text-center text-xs leading-relaxed">
            Por seguridad, nunca te pediremos tu contraseña por correo.
          </p>
        </form>
      )}

      {step === "verify" && (
        <form
          className="ph-rise space-y-5"
          onSubmit={handleVerify}
          style={{ "--ph-delay": "0.18s" } as React.CSSProperties}
        >
          <div className="border-border bg-muted/40 flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed">
            <ShieldCheckIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <p className="text-muted-foreground">
              Escribe el código exactamente como aparece en el correo. Tiene una vigencia limitada.
            </p>
          </div>

          <OtpInput
            value={code}
            onChange={(next) => {
              setCode(next);
              setError("");
            }}
            invalid={Boolean(error)}
            disabled={loading || resending}
            autoFocus
          />

          {error && (
            <p className="text-destructive bg-destructive/8 rounded-md px-3 py-2 text-sm" role="alert">
              {error}
            </p>
          )}

          {notice && (
            <p className="text-muted-foreground bg-muted/40 rounded-md px-3 py-2 text-sm" role="status">
              {notice}
            </p>
          )}

          <Button type="submit" size="lg" className="h-11 w-full" disabled={loading || code.length !== 6}>
            {loading && <Loader2Icon className="me-2 size-4 animate-spin" />}
            {loading ? "Validando código..." : "Verificar código"}
          </Button>

          <button
            type="button"
            className="text-muted-foreground hover:text-foreground inline-flex w-full items-center justify-center gap-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleResend}
            disabled={loading || resending}
          >
            {resending && <Loader2Icon className="size-3 animate-spin" />}
            {resending ? "Reenviando código..." : "¿No recibiste el código? Reenviar"}
          </button>

          <button
            type="button"
            className="text-muted-foreground hover:text-foreground w-full text-center text-xs transition-colors"
            onClick={goToRequest}
          >
            Usar otro correo
          </button>
        </form>
      )}

      {step === "reset" && (
        <form
          className="ph-rise space-y-4"
          onSubmit={handleResetPassword}
          style={{ "--ph-delay": "0.18s" } as React.CSSProperties}
        >
          <Field icon={<LockKeyholeIcon className="size-4" />}>
            <Input
              placeholder="Nueva contraseña"
              className="peer h-11 ps-10 focus-visible:ring-[var(--accent-color)]"
              type="password"
              autoComplete="new-password"
              aria-label="Nueva contraseña"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                setError("");
              }}
            />
          </Field>

          <div className="relative">
            <Field icon={<LockKeyholeIcon className="size-4" />}>
              <Input
                placeholder="Repite tu contraseña"
                className="peer h-11 pe-10 ps-10 focus-visible:ring-[var(--accent-color)]"
                type="password"
                autoComplete="new-password"
                aria-label="Repite tu contraseña"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setError("");
                }}
              />
            </Field>
            {confirmPassword && (
              <span
                className={`pointer-events-none absolute inset-y-0 end-3 flex items-center ${
                  passwordsMatch ? "text-emerald-500" : "text-destructive"
                }`}
                aria-hidden="true"
              >
                {passwordsMatch ? (
                  <CheckCircle2Icon className="size-4" />
                ) : (
                  <XCircleIcon className="size-4" />
                )}
              </span>
            )}
          </div>

          {(newPassword || confirmPassword) && (
            <div className="space-y-1 px-1 text-xs" aria-live="polite">
              <p className={passwordLengthValid ? "text-emerald-500" : "text-muted-foreground"}>
                <span className="me-1.5 inline-flex align-middle">
                  {passwordLengthValid ? (
                    <CheckCircle2Icon className="size-3.5" />
                  ) : (
                    <ShieldCheckIcon className="size-3.5" />
                  )}
                </span>
                Mínimo 8 caracteres
              </p>
              {confirmPassword && (
                <p
                  className={
                    passwordsMatch
                      ? "text-emerald-500"
                      : passwordsMismatch
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }
                >
                  <span className="me-1.5 inline-flex align-middle">
                    {passwordsMatch ? (
                      <CheckCircle2Icon className="size-3.5" />
                    ) : (
                      <XCircleIcon className="size-3.5" />
                    )}
                  </span>
                  {passwordsMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                </p>
              )}
            </div>
          )}

          {error && (
            <p className="text-destructive bg-destructive/8 rounded-md px-3 py-2 text-sm" role="alert">
              {error}
            </p>
          )}

          <p className="text-muted-foreground flex items-center gap-2 px-1 text-xs">
            <ShieldCheckIcon className="size-3.5 shrink-0" />
            Tu contraseña se guardará de forma segura.
          </p>

          <Button type="submit" size="lg" className="h-11 w-full" disabled={loading}>
            {loading && <Loader2Icon className="me-2 size-4 animate-spin" />}
            {loading ? "Guardando contraseña..." : "Guardar nueva contraseña"}
          </Button>

          <button
            type="button"
            className="text-muted-foreground hover:text-foreground w-full text-center text-xs transition-colors"
            onClick={() => {
              setStep("verify");
              setError("");
            }}
          >
            Volver al código
          </button>
        </form>
      )}

      {step === "success" && (
        <div className="ph-rise space-y-5" style={{ "--ph-delay": "0.18s" } as React.CSSProperties}>
          <div className="border-border bg-muted/40 flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed">
            <CheckCircle2Icon className="text-foreground mt-0.5 size-4 shrink-0" />
            <p className="text-muted-foreground">
              Tu nueva contraseña ya está activa. Usa el botón para volver al inicio de sesión.
            </p>
          </div>
          <Button asChild size="lg" className="h-11 w-full">
            <Link href="/login">Volver a iniciar sesión</Link>
          </Button>
        </div>
      )}
    </AuthShell>
  );
}
