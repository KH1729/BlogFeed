import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import type { Logger } from "pino";

import { errorHandler } from "./middleware/errorHandler.js";
import { createPostsRouter } from "./routes/postsRoutes.js";
import type { PostRepository } from "./services/postRepository.js";

const DEFAULT_CORS_ORIGIN = "http://localhost:5173";

/**
 * @description Builds the Express application with middleware order per project rules.
 * @param deps Logger and post repository.
 * @returns Configured Express app (not listening).
 */
export function createApp(deps: { logger: Logger; repository: PostRepository }): express.Express {
  const app = express();
  const corsOrigin = process.env["CORS_ORIGIN"] ?? DEFAULT_CORS_ORIGIN;

  app.use(helmet());
  app.use(
    cors({
      origin: corsOrigin,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
    }),
  );
  app.use(
    rateLimit({
      windowMs: 60_000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, data: { status: "ok" } });
  });

  app.use("/api/posts", createPostsRouter(deps.repository, deps.logger));

  app.use(errorHandler(deps.logger));

  return app;
}
