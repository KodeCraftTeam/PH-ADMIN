import { apiRequest } from "@/lib/http-client";

export function startRegistration(email: string) {
  return apiRequest("/auth/register/start", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resendRegistrationCode(email: string) {
  return apiRequest("/auth/register/resend", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifyRegistrationCode(email: string, code: string) {
  return apiRequest("/auth/register/verify", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export function completeRegistration(
  email: string,
  name: string,
  password: string
) {
  return apiRequest("/auth/register/complete", {
    method: "POST",
    body: JSON.stringify({ email, name, password }),
  });
}
