import { apiRequest } from "@/lib/http-client";
import type { Session } from "../model/session";

export function login(email: string, password: string) {
  return apiRequest<Session>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
