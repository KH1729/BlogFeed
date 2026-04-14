import type { NextFunction, Request, Response } from "express";

/**
 * @description Wraps an async Express handler so rejections become `next(err)`.
 * @param fn Async route handler.
 * @returns Express middleware function.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    void Promise.resolve(fn(req, res, next)).catch(next);
  };
}
