import { Wizard } from "@/features/onboarding/Wizard";
import { RequireRole } from "@/features/auth/components/RequireRole";

export default function RegistroCopropiedadPage() {
  return (
    <RequireRole role="ADMIN">
      <Wizard />
    </RequireRole>
  );
}
