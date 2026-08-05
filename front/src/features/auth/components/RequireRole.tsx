"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession, type UserRole } from "../model/session";

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
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role !== role) {
      router.replace(DASHBOARD_BY_ROLE[session.role]);
      return;
    }
    setAllowed(true);
  }, [role, router]);

  if (!allowed) return null;
  return <>{children}</>;
}
