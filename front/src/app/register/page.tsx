import { RegisterPage } from "@/components/ui/register-page";
import { RequireGuest } from "@/features/auth/components/RequireGuest";

export default function Register() {
  return (
    <RequireGuest>
      <RegisterPage />
    </RequireGuest>
  );
}
