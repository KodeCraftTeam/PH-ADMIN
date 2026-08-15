import { Suspense } from "react";
import { AuthPage } from "@/components/ui/auth-page";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthPage />
    </Suspense>
  );
}
