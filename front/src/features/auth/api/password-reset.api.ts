import { apiRequest } from "@/lib/http-client";

/**
 * Backend contract for the visual recovery flow.
 * The backend should expose this endpoint when the email workflow is ready.
 */
export function requestPasswordReset(email: string) {
  return apiRequest<void>("/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
