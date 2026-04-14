import { Router } from "express";
import type { Logger } from "pino";

import { createPostBodySchema } from "../schemas/postSchemas.js";
import type { PostRepository } from "../services/postRepository.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

/**
 * @description Registers GET /api/posts and POST /api/posts.
 * @param repository Persistence layer for posts.
 * @param logger Structured logger.
 * @returns Express router mounted at /api/posts.
 */
export function createPostsRouter(repository: PostRepository, logger: Logger): Router {
  const router = Router();

  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      const posts = await repository.listPosts();
      res.status(200).json({ success: true, data: { posts } });
    }),
  );

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const parsed = createPostBodySchema.safeParse(req.body);
      if (!parsed.success) {
        logger.warn({ issues: parsed.error.flatten() }, "create_post_validation_failed");
        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.errors[0]?.message ?? "Invalid body",
          },
        });
        return;
      }

      const post = await repository.createPost(parsed.data);
      res.status(201).json({ success: true, data: { post } });
    }),
  );

  return router;
}
