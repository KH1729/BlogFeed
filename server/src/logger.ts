import pino from "pino";

const LOG_LEVEL = process.env["LOG_LEVEL"] ?? "info";

/**
 * @description Application logger (structured; no console in production paths).
 * @param options Optional overrides (e.g. silent tests).
 * @returns Root pino instance.
 */
export function createLogger(options?: { level?: string }): pino.Logger {
  const level = options?.level ?? LOG_LEVEL;
  return pino({ level });
}
