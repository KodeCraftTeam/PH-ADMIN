"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  AtSignIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  MailCheckIcon,
  PencilIcon,
  UserIcon,
} from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";
import { OtpInput } from "./otp-input";
import { AuthSeparator, AuthShell, Field, GoogleIcon } from "./auth-shell";
import { ApiError, API_URL } from "@/lib/http-client";
import {
  completeRegistration,
  resendRegistrationCode,
  startRegistration,
  verifyRegistrationCode,
} from "@/features/auth/api/register.api";

type Step = "email" | "code" | "profile" | "done";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 45;

/** Fuerza de contraseña: 0-3. Señal visual; la validación real va en el back. */
function passwordScore(pw: string) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH = [
  { label: "", color: "" },
  { label: "Débil", color: "#ef4444" },
  { label: "Aceptable", color: "#f59e0b" },
  { label: "Fuerte", color: "#10b981" },
];

const STEP_ORDER: Step[] = ["email", "code", "profile"];

export function RegisterPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);

  // Cuenta regresiva para reenviar el código.
  useEffect(() => {
    if (resendIn <= 0) return;
    const id = window.setInterval(
      () => setResendIn((s) => (s <= 1 ? 0 : s - 1)),
      1000
    );
    return () => window.clearInterval(id);
  }, [resendIn]);


  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresá un email válido.");
      return;
    }
    setBusy(true);
    try {
      await startRegistration(email);
      setStep("code");
      setResendIn(RESEND_SECONDS);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No pudimos enviar el código. Intentá de nuevo."
      );
    } finally {
      setBusy(false);
    }
  }

  async function submitCode(value: string) {
    setError("");
    if (value.length < CODE_LENGTH) {
      setError(`El código tiene ${CODE_LENGTH} dígitos.`);
      return;
    }
    setBusy(true);
    try {
      await verifyRegistrationCode(email, value);
      setStep("profile");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Código inválido. Intentá de nuevo."
      );
    } finally {
      setBusy(false);
    }
  }

  async function submitProfile(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Ingresá tu nombre.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña necesita al menos 8 caracteres.");
      return;
    }
    setBusy(true);
    try {
      await completeRegistration(email, name, password);
      setStep("done");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No pudimos crear la cuenta. Intentá de nuevo."
      );
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (resendIn > 0) return;
    setCode("");
    setError("");
    setBusy(true);
    try {
      await resendRegistrationCode(email);
      setResendIn(RESEND_SECONDS);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No pudimos reenviar el código."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell {...SHELL_COPY}>
      {step !== "done" && <Stepper current={step} />}

      {/* key: reinicia la animación de entrada en cada paso */}
      <div key={step} className="ph-step">
        {step === "email" && (
          <EmailStep
            email={email}
            setEmail={setEmail}
            busy={busy}
            error={error}
            onSubmit={submitEmail}
          />
        )}

        {step === "code" && (
          <CodeStep
            email={email}
            code={code}
            setCode={setCode}
            busy={busy}
            error={error}
            resendIn={resendIn}
            onVerify={submitCode}
            onResend={resend}
            onChangeEmail={() => {
              setCode("");
              setError("");
              setStep("email");
            }}
          />
        )}

        {step === "profile" && (
          <ProfileStep
            name={name}
            setName={setName}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            toggleShow={() => setShowPassword((v) => !v)}
            busy={busy}
            error={error}
            onSubmit={submitProfile}
          />
        )}

        {step === "done" && <SuccessPanel name={name} />}
      </div>
    </AuthShell>
  );
}

const riseDelay = (s: number) => ({ "--ph-delay": `${s}s` }) as React.CSSProperties;

/* ── Indicador de progreso ── */

function Stepper({ current }: { current: Step }) {
  const index = STEP_ORDER.indexOf(current);
  return (
    <div className="mb-8 flex items-center gap-2" aria-hidden>
      {STEP_ORDER.map((s, i) => (
        <span
          key={s}
          className="h-1 flex-1 rounded-full transition-colors duration-500"
          style={{
            backgroundColor:
              i <= index ? "var(--accent-color)" : "var(--border)",
          }}
        />
      ))}
      <span className="text-muted-foreground ms-1 text-xs tabular-nums">
        {index + 1}/{STEP_ORDER.length}
      </span>
    </div>
  );
}

/* ── Paso 1: email ── */

function EmailStep({
  email,
  setEmail,
  busy,
  error,
  onSubmit,
}: {
  email: string;
  setEmail: (v: string) => void;
  busy: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <>
      <header className="mb-8 space-y-2">
        <h1 className="text-[2rem] leading-tight font-semibold tracking-tight">
          Creá tu cuenta
        </h1>
        <p className="text-muted-foreground">
          Empezá con tu correo. Te mandamos un código para confirmarlo.
        </p>
      </header>

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
        Registrarme con Google
      </Button>

      <AuthSeparator label="o con tu email" />

      <form className="space-y-3" onSubmit={onSubmit} noValidate>
        <Field icon={<AtSignIcon className="size-4" />}>
          <Input
            placeholder="tu.email@ejemplo.com"
            className="peer h-11 ps-10"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
          />
        </Field>

        <FormError message={error} />

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full transition-transform active:scale-[.99]"
          disabled={busy}
        >
          {busy && <Loader2Icon className="me-2 size-4 animate-spin" />}
          {busy ? "Enviando código..." : "Continuar"}
        </Button>
      </form>

      <p className="text-muted-foreground mt-8 text-center text-sm">
        ¿Ya tenés cuenta?{" "}
        <Link
          href="/login"
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </>
  );
}

/* ── Paso 2: código ── */

function CodeStep({
  email,
  code,
  setCode,
  busy,
  error,
  resendIn,
  onVerify,
  onResend,
  onChangeEmail,
}: {
  email: string;
  code: string;
  setCode: (v: string) => void;
  busy: boolean;
  error: string;
  resendIn: number;
  onVerify: (code: string) => void;
  onResend: () => void;
  onChangeEmail: () => void;
}) {
  const handleChange = (next: string) => {
    setCode(next);
    // completo: verifica solo, sin pedir click
    if (next.length === CODE_LENGTH) onVerify(next);
  };

  return (
    <>
      <header className="mb-8 space-y-2">
        <span
          className="mb-4 flex size-11 items-center justify-center rounded-xl border"
          style={{
            backgroundColor:
              "color-mix(in oklab, var(--accent-color) 10%, transparent)",
            borderColor:
              "color-mix(in oklab, var(--accent-color) 22%, transparent)",
            color: "var(--accent-color)",
          }}
        >
          <MailCheckIcon className="size-5" />
        </span>
        <h1 className="text-[2rem] leading-tight font-semibold tracking-tight">
          Revisá tu correo
        </h1>
        <p className="text-muted-foreground">
          Mandamos un código de {CODE_LENGTH} dígitos a{" "}
          <span className="text-foreground font-medium">{email}</span>.
        </p>
        <button
          type="button"
          onClick={onChangeEmail}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <PencilIcon className="size-3" />
          Cambiar correo
        </button>
      </header>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onVerify(code);
        }}
        noValidate
      >
        <OtpInput
          value={code}
          onChange={handleChange}
          length={CODE_LENGTH}
          disabled={busy}
          invalid={!!error}
          autoFocus
        />

        <FormError message={error} />

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full transition-transform active:scale-[.99]"
          disabled={busy || code.length < CODE_LENGTH}
        >
          {busy && <Loader2Icon className="me-2 size-4 animate-spin" />}
          {busy ? "Verificando..." : "Verificar código"}
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        ¿No te llegó?{" "}
        {resendIn > 0 ? (
          <span className="tabular-nums">Reenviar en {resendIn}s</span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Reenviar código
          </button>
        )}
      </p>
    </>
  );
}

/* ── Paso 3: perfil + contraseña ── */

function ProfileStep({
  name,
  setName,
  password,
  setPassword,
  showPassword,
  toggleShow,
  busy,
  error,
  onSubmit,
}: {
  name: string;
  setName: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  toggleShow: () => void;
  busy: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const score = passwordScore(password);

  return (
    <>
      <header className="mb-8 space-y-2">
        <span
          className="ph-check-circle mb-4 flex size-11 items-center justify-center rounded-xl"
          style={{
            backgroundColor: "var(--accent-color)",
            color: "var(--accent-text)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
            aria-hidden
          >
            <path className="ph-check-path" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <h1 className="text-[2rem] leading-tight font-semibold tracking-tight">
          Correo confirmado
        </h1>
        <p className="text-muted-foreground">
          Último paso: tu nombre y una contraseña.
        </p>
      </header>

      <form className="space-y-3" onSubmit={onSubmit} noValidate>
        <Field icon={<UserIcon className="size-4" />}>
          <Input
            placeholder="Nombre completo"
            className="peer h-11 ps-10"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={busy}
            autoFocus
          />
        </Field>

        <div className="space-y-2">
          <Field icon={<LockIcon className="size-4" />}>
            <Input
              placeholder="Contraseña (mínimo 8 caracteres)"
              className="peer h-11 ps-10 pe-10"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
            />
            <button
              type="button"
              onClick={toggleShow}
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

          {password && (
            <div className="flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="bg-border h-1 flex-1 rounded-full transition-colors duration-300"
                    style={
                      i <= score
                        ? { backgroundColor: STRENGTH[score].color }
                        : undefined
                    }
                  />
                ))}
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: STRENGTH[score].color }}
              >
                {STRENGTH[score].label}
              </span>
            </div>
          )}
        </div>

        <FormError message={error} />

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full transition-transform active:scale-[.99]"
          disabled={busy}
        >
          {busy && <Loader2Icon className="me-2 size-4 animate-spin" />}
          {busy ? "Creando cuenta..." : "Crear cuenta"}
        </Button>

        <p className="text-muted-foreground pt-1 text-center text-xs leading-relaxed">
          Al continuar aceptás nuestros{" "}
          <Link href="#" className="hover:text-foreground underline underline-offset-2">
            Términos
          </Link>{" "}
          y la{" "}
          <Link href="#" className="hover:text-foreground underline underline-offset-2">
            Política de Privacidad
          </Link>
          .
        </p>
      </form>
    </>
  );
}

/* ── Éxito ── */

function SuccessPanel({ name }: { name: string }) {
  const firstName = name.trim().split(" ")[0];

  return (
    <div className="text-center">
      <div className="relative mx-auto mb-7 flex size-20 items-center justify-center">
        <span
          aria-hidden
          className="ph-check-ring absolute inset-0 rounded-full"
          style={{
            backgroundColor:
              "color-mix(in oklab, var(--accent-color) 35%, transparent)",
          }}
        />
        <span
          className="ph-check-circle relative flex size-20 items-center justify-center rounded-full"
          style={{
            backgroundColor: "var(--accent-color)",
            color: "var(--accent-text)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-9"
            aria-hidden
          >
            <path className="ph-check-path" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      </div>

      <h1
        className="ph-rise text-[2rem] leading-tight font-semibold tracking-tight"
        style={riseDelay(0.5)}
      >
        ¡Cuenta creada!
      </h1>
      <p className="ph-rise text-muted-foreground mt-3" style={riseDelay(0.58)}>
        {firstName ? `Listo, ${firstName}. ` : "Listo. "}
        Ya podés ingresar y configurar tu primera copropiedad.
      </p>

      <div className="ph-rise mt-8 space-y-3" style={riseDelay(0.66)}>
        <Button asChild size="lg" className="h-11 w-full">
          <Link href="/login">Ir a iniciar sesión</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-11 w-full font-normal"
        >
          <Link href="/onboarding">Configurar mi copropiedad</Link>
        </Button>
      </div>
    </div>
  );
}

/* ── Compartido ── */

function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p
      className="text-destructive bg-destructive/8 rounded-md px-3 py-2 text-sm"
      role="alert"
    >
      {message}
    </p>
  );
}

const SHELL_COPY = {
  quote: (
    <>
      Configuramos las 120 unidades en una tarde. Lo que antes nos llevaba{" "}
      <span className="relative whitespace-nowrap">
        semanas de planillas
        <span
          className="absolute inset-x-0 -bottom-0.5 h-px opacity-70"
          style={{ backgroundColor: "var(--accent-color)" }}
        />
      </span>
      .
    </>
  ),
  author: "Torres del Parque",
  authorMeta: "86 unidades · Medellín",
  stats: [
    { value: "5 min", label: "Puesta en marcha" },
    { value: "0", label: "Planillas sueltas" },
    { value: "24/7", label: "Acceso al panel" },
  ],
};
