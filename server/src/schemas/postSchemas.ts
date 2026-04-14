import { z } from "zod";

/**
 * @description Validates request body for POST /api/posts.
 */
export const createPostBodySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(500),
  body: z.string().trim().min(1, "Body is required").max(50_000),
});

export type CreatePostBody = z.infer<typeof createPostBodySchema>;
