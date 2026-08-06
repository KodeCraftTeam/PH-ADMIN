import { apiRequest } from "@/lib/http-client";
import type { Session } from "../model/session";

export function getMe() {
  return apiRequest<Session>("/auth/me");
}
