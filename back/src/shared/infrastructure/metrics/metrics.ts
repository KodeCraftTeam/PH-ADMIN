import { Registry, collectDefaultMetrics } from 'prom-client';

export const register = new Registry();

let initialized = false;

export function initMetrics(): void {
  if (initialized) return;
  collectDefaultMetrics({ register });
  initialized = true;
}
