import { apiRequest } from "@/lib/http-client";

/** API calls for the three-step password recovery flow. */
export function requestPasswordReset(email: string) {
  return apiRequest<void>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifyPasswordResetCode(email: string, code: string) {
  return apiRequest<void>("/auth/reset-password/verify", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export function resetPassword(email: string, code: string, newPassword: string) {
  return apiRequest<void>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, code, newPassword }),
  });
}
