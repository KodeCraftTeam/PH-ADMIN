import { Suspense } from "react";
import { AuthPage } from "@/components/ui/auth-page";
import { RequireGuest } from "@/features/auth/components/RequireGuest";

export default function LoginPage() {
  return (
    <RequireGuest>
      <Suspense fallback={null}>
        <AuthPage />
      </Suspense>
    </RequireGuest>
  );
}
