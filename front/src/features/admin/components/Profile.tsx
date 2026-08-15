'use client';

import { useEffect, useState } from "react";
import { Card, IconUser } from "@/components/ui";
import { getMe } from "@/features/auth/api/me.api";
import { getSession, Session } from "@/features/auth/model/session";
import { PropertiesShell } from "./PropertiesShell";

export default function Profile() {
  const [session, setLocalSession] = useState<Session | null>(() => getSession());

  useEffect(() => {
    getMe()
      .then((user) => {
        if (user) setLocalSession(user);
      })
      .catch(() => {
        // keep whatever was already in local storage
      });
  }, []);

  const displayName = session?.name?.trim() || "Usuario";
  const initials =
    displayName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <PropertiesShell>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
              Mi Perfil
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
              Información de tu cuenta de administrador.
            </p>
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                {initials}
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-zinc-100">
                  {displayName}
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  {session?.role === "SUPER_ADMIN" ? "Super Administrador" : "Administrador"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 shrink-0">
                  <IconUser className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Nombre
                  </p>
                  <p className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                    {displayName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 shrink-0">
                  <IconUser className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Rol
                  </p>
                  <p className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                    {session?.role === "SUPER_ADMIN" ? "Super Administrador" : "Administrador"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PropertiesShell>
  );
}
