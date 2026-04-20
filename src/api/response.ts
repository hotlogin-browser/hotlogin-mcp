import type { LocalServiceEnvelope } from '../types.js';

export function unwrapEnvelope<T>(response: { data: LocalServiceEnvelope<T> }, scene: string): T {
  const { code, data, msg } = response.data;
  if (code === 0 || code === '0') {
    return data;
  }

  throw new Error(`[${scene}] ${msg}`);
}

export function presentResult(label: string, data: unknown): string {
  return `${label}\n${JSON.stringify(data, null, 2)}`;
}
