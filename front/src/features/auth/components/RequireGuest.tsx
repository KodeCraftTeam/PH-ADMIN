"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession, setSession, DASHBOARD_BY_ROLE } from "../model/session";
import { getMe } from "../api/me.api";

export function RequireGuest({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      let session = getSession();

      if (!session) {
        try {
          session = await getMe();
          setSession(session);
        } catch {
          if (!cancelled) setChecked(true);
          return;
        }
      }

      if (cancelled) return;
      router.replace(DASHBOARD_BY_ROLE[session.role]);
    }

    void check();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!checked) return null;
  return <>{children}</>;
}
