import { SuperAdmin } from "@/features/superadmin/SuperAdmin";
import { RequireRole } from "@/features/auth/components/RequireRole";

export default function SuperAdminPage() {
  return (
    <RequireRole role="SUPER_ADMIN">
      <SuperAdmin />
    </RequireRole>
  );
}
