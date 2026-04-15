import { z } from "zod";

/**
 * @description Shared title/body rules for POST create and PATCH update.
 */
export const postTitleBodySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(500),
  body: z.string().trim().min(1, "Body is required").max(50_000),
});

/**
 * @description Validates request body for POST /api/posts.
 */
export const createPostBodySchema = postTitleBodySchema;

/**
 * @description Validates request body for PATCH /api/posts/:id.
 */
export const updatePostBodySchema = postTitleBodySchema;

export type CreatePostBody = z.infer<typeof createPostBodySchema>;
