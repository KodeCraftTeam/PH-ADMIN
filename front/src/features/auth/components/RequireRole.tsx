"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession, setSession, clearSession, type UserRole } from "../model/session";
import { getMe } from "../api/me.api";
import { setUnauthorizedHandler } from "@/lib/http-client";

const DASHBOARD_BY_ROLE: Record<UserRole, string> = {
  ADMIN: "/admin",
  SUPER_ADMIN: "/superadmin",
};

export function RequireRole({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setUnauthorizedHandler((code) => {
      const hadSession = getSession() !== null;
      clearSession();

      if (!hadSession) {
        router.replace("/login");
        return;
      }

      const reason = code === "TOKEN_EXPIRED" ? "expired" : "unauthorized";
      router.replace(`/login?reason=${reason}`);
    });
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      let session = getSession();

      if (!session) {
        try {
          session = await getMe();
          setSession(session);
        } catch {
          if (!cancelled) router.replace("/login");
          return;
        }
      }

      if (cancelled) return;

      if (session.role !== role) {
        router.replace(DASHBOARD_BY_ROLE[session.role]);
        return;
      }
      setAllowed(true);
    }

    void check();

    return () => {
      cancelled = true;
    };
  }, [role, router]);

  if (!allowed) return null;
  return <>{children}</>;
}
