import { Wizard } from "@/features/onboarding/Wizard";
import { RequireRole } from "@/features/auth/components/RequireRole";

export default function RegisterCopropertyPage() {
  return (
    <RequireRole role="ADMIN">
      <Wizard />
    </RequireRole>
  );
}
