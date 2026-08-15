import { RequireRole } from "@/features/auth/components/RequireRole";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole role="SUPER_ADMIN">{children}</RequireRole>;
}
