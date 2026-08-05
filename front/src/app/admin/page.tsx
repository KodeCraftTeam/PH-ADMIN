import { AdminDashboard } from "@/features/admin/AdminDashboard";
import { RequireRole } from "@/features/auth/components/RequireRole";

export default function AdminPage() {
  return (
    <RequireRole role="ADMIN">
      <AdminDashboard />
    </RequireRole>
  );
}
