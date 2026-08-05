"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

import { Button } from "./button";
import { BuildingFacade } from "./building-facade";
import { Logo } from "./logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

/** Layout de dos paneles compartido por login y registro. */
export function AuthShell({
  children,
  quote,
  author,
  authorMeta,
  stats,
}: {
  children: React.ReactNode;
  quote: React.ReactNode;
  author: string;
  authorMeta: string;
  stats: { value: string; label: string }[];
}) {
  return (
    <main className="lg:grid-cols-[1.05fr_1fr] relative lg:grid lg:h-screen lg:overflow-hidden">
      <aside className="relative hidden h-full flex-col justify-between overflow-hidden bg-zinc-950 p-12 text-zinc-100 lg:flex">
        <BuildingFacade />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20" />
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/80 via-transparent to-transparent" />

        <Link
          href="/"
          className="relative z-10 flex w-fit transition-opacity hover:opacity-75"
        >
          <Logo invert />
        </Link>

        <div className="relative z-10 max-w-md">
          <blockquote className="space-y-6">
            <p className="text-[1.65rem] leading-[1.35] font-light tracking-tight text-balance text-white">
              {quote}
            </p>
            <footer className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xs font-semibold backdrop-blur-sm">
                {author
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="text-sm">
                <p className="font-medium text-white">{author}</p>
                <p className="text-zinc-400">{authorMeta}</p>
              </div>
            </footer>
          </blockquote>

          <div className="mt-10 flex gap-10 border-t border-white/10 pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-xl font-semibold tracking-tight text-white">
                  {s.value}
                </p>
                <p className="text-xs text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <section className="relative flex min-h-screen flex-col justify-center px-5 py-16 lg:min-h-0 lg:px-8">
        <AmbientBlobs />

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground absolute top-6 left-4"
          asChild
        >
          <Link href="/">
            <ChevronLeftIcon className="me-1.5 size-4" />
            Inicio
          </Link>
        </Button>

        <div className="absolute top-6 right-4">
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-[26rem]">
          <Link
            href="/"
            className="ph-rise mb-8 flex w-fit lg:hidden"
            style={{ "--ph-delay": "0.05s" } as React.CSSProperties}
          >
            <Logo />
          </Link>
          {children}
        </div>
      </section>
    </main>
  );
}

function AmbientBlobs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="ph-drift absolute -top-32 -right-24 size-[30rem] rounded-full opacity-[0.07] blur-3xl"
        style={
          {
            backgroundColor: "var(--accent-color)",
            "--ph-dur": "26s",
          } as React.CSSProperties
        }
      />
      <div
        className="ph-drift bg-foreground absolute -bottom-40 -left-32 size-[26rem] rounded-full opacity-[0.05] blur-3xl"
        style={{ "--ph-dur": "34s", "--ph-delay": "-8s" } as React.CSSProperties}
      />
    </div>
  );
}

/** Input con ícono a la izquierda (y lo que le pases a la derecha). */
export function Field({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-max">
      {children}
      <span className="text-muted-foreground peer-focus-visible:text-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 transition-colors peer-disabled:opacity-50">
        {icon}
      </span>
    </div>
  );
}

export function AuthSeparator({ label }: { label: string }) {
  return (
    <div className="my-6 flex w-full items-center justify-center">
      <div className="bg-border h-px w-full" />
      <span className="text-muted-foreground shrink-0 px-3 text-[11px] font-medium tracking-[0.12em] whitespace-nowrap uppercase">
        {label}
      </span>
      <div className="bg-border h-px w-full" />
    </div>
  );
}

export const GoogleIcon = (props: React.ComponentProps<"svg">) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      fill="#4285F4"
      d="M23.52 12.273c0-.851-.076-1.67-.218-2.455H12v4.642h6.458a5.52 5.52 0 0 1-2.394 3.622v3.01h3.878c2.269-2.088 3.578-5.165 3.578-8.819z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.956-1.075 7.942-2.908l-3.878-3.01c-1.075.72-2.45 1.145-4.064 1.145-3.125 0-5.77-2.11-6.715-4.947H1.276v3.107A11.995 11.995 0 0 0 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.285 14.28A7.212 7.212 0 0 1 4.909 12c0-.791.136-1.56.376-2.28V6.613H1.276A11.995 11.995 0 0 0 0 12c0 1.936.464 3.769 1.276 5.387l4.009-3.107z"
    />
    <path
      fill="#EA4335"
      d="M12 4.773c1.762 0 3.344.605 4.587 1.794l3.442-3.442C17.951 1.19 15.235 0 12 0 7.309 0 3.25 2.69 1.276 6.613l4.009 3.107C6.23 6.883 8.875 4.773 12 4.773z"
    />
  </svg>
);
