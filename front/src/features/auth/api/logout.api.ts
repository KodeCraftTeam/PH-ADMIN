import { apiRequest } from "@/lib/http-client";

export function logout() {
  return apiRequest("/auth/logout", { method: "POST" });
}
