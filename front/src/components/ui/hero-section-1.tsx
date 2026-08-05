"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CreditCard,
  Menu,
  MessageSquare,
  ShieldCheck,
  Wand2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BuildingFacade } from "@/components/ui/building-facade";
import { Logo } from "@/components/ui/logo";
import { CountUp, Reveal } from "@/components/ui/reveal";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden">
        <Hero />
        <Features />
        <FinalCta />
        <SiteFooter />
      </main>
    </>
  );
}

/* ─────────────── Hero ─────────────── */

function Hero() {
  return (
    <section className="relative">
      {/* Ambiente: blobs a la deriva en color de acento */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="ph-drift absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 rounded-full opacity-[0.10] blur-3xl"
          style={
            {
              backgroundColor: "var(--accent-color)",
              "--ph-dur": "28s",
            } as React.CSSProperties
          }
        />
        <div
          className="ph-drift bg-foreground absolute top-40 -right-32 size-[26rem] rounded-full opacity-[0.05] blur-3xl"
          style={
            { "--ph-dur": "36s", "--ph-delay": "-10s" } as React.CSSProperties
          }
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-36 pb-16 md:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/superadmin"
            className="bg-muted/60 hover:bg-muted ph-rise group mx-auto flex w-fit items-center gap-3 rounded-full border py-1.5 pr-1.5 pl-4 text-sm backdrop-blur-sm transition-colors"
            style={{ "--ph-delay": "0.05s" } as React.CSSProperties}
          >
            <span className="relative flex size-1.5">
              <span
                className="absolute inline-flex size-full animate-ping rounded-full opacity-60"
                style={{ backgroundColor: "var(--accent-color)" }}
              />
              <span
                className="relative inline-flex size-1.5 rounded-full"
                style={{ backgroundColor: "var(--accent-color)" }}
              />
            </span>
            <span>Plataforma SaaS para copropiedades y conjuntos</span>
            <span className="bg-background flex size-6 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="size-3" />
            </span>
          </Link>

          <h1
            className="ph-rise mt-8 text-[2.75rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance md:text-6xl lg:text-[4.25rem]"
            style={{ "--ph-delay": "0.12s" } as React.CSSProperties}
          >
            La gestión de tus copropiedades,{" "}
            <span className="relative whitespace-nowrap">
              en un solo lugar
              <span
                className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full opacity-80"
                style={{ backgroundColor: "var(--accent-color)" }}
              />
            </span>
          </h1>

          <p
            className="ph-rise text-muted-foreground mx-auto mt-7 max-w-2xl text-lg text-balance"
            style={{ "--ph-delay": "0.2s" } as React.CSSProperties}
          >
            Cartera, comunicados, analítica financiera y onboarding guiado.
            Control administrativo total y transparencia con los propietarios.
          </p>

          <div
            className="ph-rise mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ "--ph-delay": "0.28s" } as React.CSSProperties}
          >
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-xl px-7 text-base transition-transform active:scale-[.99] sm:w-auto"
            >
              <Link href="/onboarding">Comenzar onboarding</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-xl px-7 text-base font-normal transition-transform active:scale-[.99] sm:w-auto"
            >
              <Link href="/login">Ingresar a mi panel</Link>
            </Button>
          </div>
        </div>

        {/* Preview del dashboard */}
        <div
          className="ph-rise relative mt-16 md:mt-20"
          style={{ "--ph-delay": "0.36s" } as React.CSSProperties}
        >
          <div
            aria-hidden
            className="absolute -inset-x-8 -top-8 bottom-0 -z-10 rounded-[2rem] opacity-20 blur-2xl"
            style={{
              background:
                "linear-gradient(to bottom, var(--accent-color), transparent 70%)",
            }}
          />
          <div className="bg-background/60 ring-border/60 relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-1.5 shadow-2xl shadow-black/10 ring-1 backdrop-blur-sm">
            <img
              className="block w-full rounded-xl border-border/40 border object-cover"
              src="/dashboard-preview.png"
              alt="Panel SuperAdmin de KodeCraft PH"
              width={1920}
              height={945}
            />
          </div>
          <div
            aria-hidden
            className="from-background pointer-events-none absolute inset-x-0 -bottom-1 h-32 bg-gradient-to-t to-transparent"
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Features ─────────────── */

const FEATURES = [
  {
    icon: CreditCard,
    title: "Cartera y cobranza",
    body: "Control en tiempo real de cuotas de administración, facturación recurrente y estado de mora por inmueble.",
    href: "/admin",
    cta: "Ver dashboard",
  },
  {
    icon: Wand2,
    title: "Onboarding en minutos",
    body: "Asistente paso a paso para crear copropiedades, torres, unidades y cargar coeficientes de forma masiva.",
    href: "/onboarding",
    cta: "Abrir asistente",
  },
  {
    icon: MessageSquare,
    title: "Comunicados y PQRS",
    body: "Circulares generales y gestión centralizada de peticiones, quejas y reclamos de toda la comunidad.",
    href: "/admin",
    cta: "Ver dashboard",
  },
  {
    icon: BarChart3,
    title: "Métricas y analítica",
    body: "Gráficos interactivos de rendimiento comercial, distribución por planes y tasa de retención global.",
    href: "/superadmin",
    cta: "Ver panel",
  },
  {
    icon: Building2,
    title: "Multi-copropiedad",
    body: "Administra múltiples conjuntos residenciales, torres y cientos de unidades de forma limpia e independiente.",
    href: "/superadmin",
    cta: "Ver panel",
  },
  {
    icon: ShieldCheck,
    title: "Permisos por rol",
    body: "Roles granulares para superadmin, administradores de conjunto, contadores y residentes.",
    href: "/superadmin",
    cta: "Ver panel",
  },
];

/** Entrada alternada por columna: izquierda / abajo / derecha. */
const COLUMN_DIRECTION = ["left", "up", "right"] as const;

function Features() {
  return (
    <section className="border-t py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
            Tu aliado en gestión inmobiliaria
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Todo lo que necesita tu copropiedad
          </h2>
          <p className="text-muted-foreground mt-4 text-balance">
            Pensado para dar control administrativo total, transparencia con los
            propietarios y automatización de procesos contables.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, href, cta }, i) => (
            <Reveal
              key={title}
              from={COLUMN_DIRECTION[i % 3]}
              delay={(i % 3) * 0.08}
            >
              <Link
                href={href}
                className="group bg-card relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, var(--accent-color), transparent)",
                  }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(70% 50% at 50% 0%, color-mix(in oklab, var(--accent-color) 10%, transparent), transparent)",
                  }}
                />
                <div className="relative flex h-full flex-col">
                  <span
                    className="mb-5 flex size-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor:
                        "color-mix(in oklab, var(--accent-color) 10%, transparent)",
                      borderColor:
                        "color-mix(in oklab, var(--accent-color) 22%, transparent)",
                      color: "var(--accent-color)",
                    }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {body}
                  </p>
                  <span className="mt-5 flex items-center gap-1.5 pt-1 text-sm font-medium opacity-0 transition-all duration-300 group-hover:opacity-100">
                    {cta}
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Banda de métricas */}
        <Reveal from="zoom">
          <div className="bg-muted/40 mt-4 grid grid-cols-2 gap-6 rounded-2xl border p-8 text-center md:grid-cols-4">
            <Metric
              label="MRR facturado"
              node={<CountUp value={9.2} decimals={1} prefix="$" suffix="M+" />}
            />
            <Metric label="Unidades registradas" node={<CountUp value={792} />} />
            <Metric
              label="Tasa de retención"
              node={<CountUp value={96.8} decimals={1} suffix="%" />}
            />
            <Metric
              label="Transparencia y control"
              node={<CountUp value={100} suffix="%" />}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Metric({ node, label }: { node: React.ReactNode; label: string }) {
  return (
    <div>
      <p className="text-3xl font-semibold tracking-tight tabular-nums">
        {node}
      </p>
      <p className="text-muted-foreground mt-1 text-sm">{label}</p>
    </div>
  );
}

/* ─────────────── CTA final (espeja el panel del login) ─────────────── */

function FinalCta() {
  return (
    <section className="px-6 pb-24">
      <Reveal
        from="zoom"
        className="relative mx-auto block max-w-7xl overflow-hidden rounded-3xl bg-zinc-950 px-8 py-20 text-center text-zinc-100"
      >
        <BuildingFacade cols={22} rows={10} tilt={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-white md:text-4xl">
            Empezá a administrar mejor tu copropiedad
          </h2>
          <p className="mt-4 text-zinc-400 text-balance">
            Ingresá a tu panel o creá tu primera copropiedad con el asistente
            guiado.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-xl bg-white px-7 text-base text-zinc-950 hover:bg-zinc-200 sm:w-auto"
            >
              <Link href="/login">Ingresar a mi panel</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-xl border-white/20 bg-white/5 px-7 text-base font-normal text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <Link href="/onboarding">Comenzar onboarding</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────── Header ─────────────── */

const MENU = [
  { name: "Panel SuperAdmin", href: "/superadmin" },
  { name: "Dashboard Admin", href: "/admin" },
  { name: "Onboarding", href: "/onboarding" },
];

function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-30 px-3 pt-3">
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-6 rounded-2xl border border-transparent px-4 py-3 transition-all duration-300",
          scrolled &&
            "bg-background/70 max-w-5xl border-border shadow-sm backdrop-blur-lg"
        )}
      >
        <Link href="/" aria-label="Inicio">
          <Logo />
        </Link>

        <ul className="hidden gap-8 text-sm lg:flex">
          {MENU.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Crear cuenta</Link>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="hover:bg-muted -mr-1 ml-1 rounded-lg p-2 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="bg-background/95 mx-auto mt-2 max-w-6xl rounded-2xl border p-4 shadow-lg backdrop-blur-lg lg:hidden">
          <ul className="space-y-1">
            {MENU.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="hover:bg-muted block rounded-lg px-3 py-2.5 text-sm transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="border-t pt-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="hover:bg-muted block rounded-lg px-3 py-2.5 text-sm transition-colors"
              >
                Iniciar sesión
              </Link>
            </li>
          </ul>
          <div className="mt-3 border-t pt-3 sm:hidden">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}

/* ─────────────── Footer ─────────────── */

function SiteFooter() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <Logo />
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Iniciar sesión
          </Link>
        </nav>
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} KodeCraft PH
        </p>
      </div>
    </footer>
  );
}
