"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  CreditCard,
  Lock,
  Menu,
  MessageSquare,
  Plus,
  Quote,
  ShieldCheck,
  Wand2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BuildingFacade } from "@/components/ui/building-facade";
import { Logo } from "@/components/ui/logo";
import { CountUp, Reveal, ScrollProgress } from "@/components/ui/reveal";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main className="overflow-hidden">
        <Hero />
        {/* <HowItWorks /> */}
        {/* <Features /> */}
        {/* <Testimonials /> */}
        {/* <Pricing /> */}
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}

/** Etiqueta chica arriba del título de cada sección. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
      {children}
    </p>
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
            <span className="whitespace-nowrap">
              Plataforma SaaS para copropiedades
            </span>
            <span className="bg-background flex size-6 shrink-0 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5">
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

        {/* Preview del dashboard: entra inclinado y se endereza */}
        <Reveal from="tilt" className="relative mt-16 block md:mt-20">
          <div
            aria-hidden
            className="absolute -inset-x-8 -top-8 bottom-0 -z-10 rounded-[2rem] opacity-20 blur-2xl"
            style={{
              background:
                "linear-gradient(to bottom, var(--accent-color), transparent 70%)",
            }}
          />
          <div className="bg-card ring-border/60 relative mx-auto max-w-6xl overflow-hidden rounded-2xl border shadow-2xl shadow-black/20 ring-1">
            {/* Barra de navegador falsa: hace que se lea como producto real */}
            <div className="bg-muted/60 flex items-center gap-2 border-b px-4 py-2.5">
              <span className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-red-400/70" />
                <span className="size-2.5 rounded-full bg-yellow-400/70" />
                <span className="size-2.5 rounded-full bg-green-400/70" />
              </span>
              <span className="bg-background/70 text-muted-foreground mx-auto flex items-center gap-1.5 rounded-md px-3 py-1 text-xs">
                <Lock className="size-3" />
                app.kodecraftph.com/superadmin
              </span>
            </div>
            <img
              className="block w-full object-cover"
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
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────── Cómo funciona ─────────────── */

const STEPS = [
  {
    title: "Creá tu copropiedad",
    body: "Cargás los datos del conjunto, las torres y la estructura. El asistente te guía campo por campo.",
  },
  {
    title: "Importá las unidades",
    body: "Subís el archivo con unidades y coeficientes. El sistema valida que los coeficientes sumen 100%.",
  },
  {
    title: "Empezá a facturar",
    body: "Generás las cuotas de administración, seguís la cartera y comunicás a los propietarios.",
  },
];

function HowItWorks() {
  return (
    <section className="border-t py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <Eyebrow>En tres pasos</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            De cero a facturando en una tarde
          </h2>
        </Reveal>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* línea que conecta los pasos */}
          <div
            aria-hidden
            className="bg-border absolute inset-x-0 top-6 hidden h-px md:block"
          />
          {STEPS.map((s, i) => (
            <Reveal key={s.title} from="up" delay={i * 0.1}>
              <div className="relative text-center md:text-left">
                <span
                  className="bg-background relative z-10 mx-auto flex size-12 items-center justify-center rounded-full border-2 text-lg font-semibold md:mx-0"
                  style={{
                    borderColor: "var(--accent-color)",
                    color: "var(--accent-color)",
                  }}
                >
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Testimonios ─────────────── */

// ponytail: copy de muestra, NO son clientes reales. Reemplazar antes de publicar.
const TESTIMONIALS = [
  {
    quote:
      "Pasamos de planillas sueltas a tener toda la propiedad horizontal ordenada en un solo lugar. La cartera dejó de ser un dolor de cabeza.",
    name: "Carla Jiménez",
    role: "Administradora · Edificio Aurora",
    meta: "120 unidades · Bogotá",
  },
  {
    quote:
      "Configuramos las 86 unidades en una tarde. Lo que antes nos llevaba semanas de planillas y correos cruzados.",
    name: "Diego Vélez",
    role: "Administrador · Torres del Parque",
    meta: "86 unidades · Medellín",
  },
  {
    quote:
      "Los propietarios ven su estado de cuenta cuando quieren. Bajamos las llamadas a la oficina casi a cero.",
    name: "Marcela Ruiz",
    role: "Contadora · Conjunto Sierra",
    meta: "210 unidades · Cali",
  },
];

function Testimonials() {
  return (
    <section className="border-t py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <Eyebrow>Quiénes ya lo usan</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Administradores que dejaron las planillas
          </h2>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} from={COLUMN_DIRECTION[i % 3]} delay={i * 0.08}>
              <figure className="bg-card flex h-full flex-col rounded-2xl border p-6">
                <Quote
                  className="mb-4 size-6 shrink-0"
                  style={{ color: "var(--accent-color)" }}
                />
                <blockquote className="text-[15px] leading-relaxed">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-full border text-xs font-semibold"
                    style={{
                      backgroundColor:
                        "color-mix(in oklab, var(--accent-color) 12%, transparent)",
                      borderColor:
                        "color-mix(in oklab, var(--accent-color) 24%, transparent)",
                      color: "var(--accent-color)",
                    }}
                  >
                    {t.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div className="text-sm">
                    <p className="font-medium">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                    <p className="text-muted-foreground text-xs">{t.meta}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Precios ─────────────── */

// ponytail: precios de muestra. Ajustar a los reales antes de publicar.
const PLANS = [
  {
    name: "Básico",
    price: "$290.000",
    period: "/mes",
    tagline: "Para una copropiedad chica.",
    features: [
      "Hasta 50 unidades",
      "Cartera y cuotas",
      "Comunicados",
      "1 administrador",
    ],
    cta: "Empezar",
    href: "/register",
    featured: false,
  },
  {
    name: "Pro",
    price: "$690.000",
    period: "/mes",
    tagline: "El que usan la mayoría.",
    features: [
      "Hasta 200 unidades",
      "Todo lo del Básico",
      "PQRS y analítica",
      "Hasta 5 administradores",
      "Soporte prioritario",
    ],
    cta: "Empezar",
    href: "/register",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "A medida",
    period: "",
    tagline: "Varias copropiedades.",
    features: [
      "Unidades ilimitadas",
      "Todo lo del Pro",
      "Multi-copropiedad",
      "Roles y permisos finos",
      "Acompañamiento dedicado",
    ],
    cta: "Hablar con ventas",
    href: "/register",
    featured: false,
  },
];

function Pricing() {
  return (
    <section id="precios" className="border-t py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <Eyebrow>Precios</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Un plan por tamaño de copropiedad
          </h2>
          <p className="text-muted-foreground mt-4 text-balance">
            Sin permanencia mínima. Cambiás de plan cuando crecés.
          </p>
        </Reveal>

        <div className="grid items-start gap-4 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal
              key={plan.name}
              from={COLUMN_DIRECTION[i % 3]}
              delay={i * 0.08}
            >
              <div
                className={cn(
                  "bg-card relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300",
                  plan.featured
                    ? "shadow-xl shadow-black/5 md:-translate-y-3 md:p-8"
                    : "hover:-translate-y-1"
                )}
                style={
                  plan.featured
                    ? { borderColor: "var(--accent-color)" }
                    : undefined
                }
              >
                {plan.featured && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase"
                    style={{
                      backgroundColor: "var(--accent-color)",
                      color: "var(--accent-text)",
                    }}
                  >
                    Más elegido
                  </span>
                )}

                <h3 className="text-lg font-semibold tracking-tight">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {plan.tagline}
                </p>

                <p className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight tabular-nums">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {plan.period}
                  </span>
                </p>

                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        className="mt-0.5 size-4 shrink-0"
                        style={{ color: "var(--accent-color)" }}
                      />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="lg"
                  variant={plan.featured ? "default" : "outline"}
                  className="mt-8 h-11 w-full"
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── FAQ ─────────────── */

const FAQS = [
  {
    q: "¿Cuánto tarda la puesta en marcha?",
    a: "Una tarde. El asistente de onboarding te lleva paso a paso: datos del conjunto, torres, unidades y coeficientes. Si tenés las unidades en un archivo, las importás de una.",
  },
  {
    q: "¿Puedo administrar más de una copropiedad?",
    a: "Sí, con el plan Enterprise. Cada conjunto queda aislado con su propia contabilidad, sus unidades y sus permisos, pero los ves todos desde el mismo panel.",
  },
  {
    q: "¿Qué pasa con los coeficientes de copropiedad?",
    a: "El sistema valida que sumen 100% al importarlos y te marca las filas que no cuadran antes de guardar nada.",
  },
  {
    q: "¿Los propietarios tienen acceso?",
    a: "Los propietarios consultan su estado de cuenta y reciben los comunicados. Los permisos se definen por rol, así que vos decidís qué ve cada quien.",
  },
  {
    q: "¿Puedo cambiar de plan después?",
    a: "Cuando quieras, y sin permanencia mínima. Si tu copropiedad crece y pasás el límite de unidades, te avisamos antes de cobrarte de más.",
  },
];

function Faq() {
  return (
    <section className="border-t py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="mb-12 text-center">
          <Eyebrow>Preguntas</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Lo que suelen preguntarnos
          </h2>
        </Reveal>

        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <Reveal key={item.q} from="up" delay={i * 0.05}>
              {/* <details> nativo: accesible y sin JS */}
              <details className="group bg-card rounded-2xl border px-5 transition-colors hover:border-foreground/20">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium">
                  {item.q}
                  <Plus className="ph-faq-icon text-muted-foreground size-4 shrink-0 transition-transform duration-300" />
                </summary>
                <p className="ph-faq-body text-muted-foreground pb-5 text-sm leading-relaxed">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
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
          
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────── Header ─────────────── */

type MenuItem = { name: string; href: string; };

const MENU : MenuItem[] = [
  // { name: "Panel SuperAdmin", href: "/superadmin" },
  // { name: "Dashboard Admin", href: "/admin" },
  // { name: "Onboarding", href: "/onboarding" },
  // { name: "Precios", href: "#precios" },
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

const FOOTER_COLUMNS = [
  // {
  //   title: "Producto",
  //   links: [
  //     // { name: "Panel SuperAdmin", href: "/superadmin" },
  //     // { name: "Dashboard Admin", href: "/admin" },
  //     // { name: "Onboarding", href: "/onboarding" },
  //     // { name: "Precios", href: "#precios" },
  //   ],
  // },
  {
    title: "Cuenta",
    links: [
      { name: "Iniciar sesión", href: "/login" },
      { name: "Crear cuenta", href: "/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Términos", href: "#" },
      { name: "Privacidad", href: "#" },
      { name: "Tratamiento de datos", href: "#" },
    ],
  },
];

function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              La plataforma para administrar copropiedades: cartera,
              comunicados y analítica en un solo lugar.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <Link
                      href={l.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} KodeCraft PH. Todos los derechos
            reservados.
          </p>
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <ShieldCheck className="size-3.5" />
            Datos alojados en Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}
