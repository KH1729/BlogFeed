import type { NextFunction, Request, Response } from "express";
import type { Logger } from "pino";
import { ZodError } from "zod";

/**
 * @description Maps errors to HTTP responses with a consistent JSON envelope.
 */
export function errorHandler(logger: Logger) {
  return (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    if (res.headersSent) {
      return;
    }

    if (err instanceof ZodError) {
      const message = err.errors[0]?.message ?? "Validation failed";
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message },
      });
      return;
    }

    logger.error({ err }, "unhandled_error");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
    });
  };
}
