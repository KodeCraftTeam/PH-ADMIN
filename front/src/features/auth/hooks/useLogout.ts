"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "../api/logout.api";
import { clearSession } from "../model/session";

export function useLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
    } finally {
      clearSession();
      router.replace("/");
    }
  }

  return { logout: handleLogout, loading };
}
