import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../domain/api-error.js";
import { log } from "../lib/logger.js";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    error: "NOT_FOUND",
    message: "Route not found."
  });
}

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      error: error.code,
      message: error.message
    });
    return;
  }

  log({
    level: "error",
    message: "Unhandled API error",
    requestId: req.requestId,
    context: {
      error: error instanceof Error ? error.message : String(error)
    }
  });

  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong."
  });
}
