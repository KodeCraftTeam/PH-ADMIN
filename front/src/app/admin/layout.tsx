import { RequireRole } from "@/features/auth/components/RequireRole";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole role="ADMIN">{children}</RequireRole>;
}
