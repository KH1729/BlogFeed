import { z } from "zod";

import type { Post } from "../types/post.js";

const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  createdAt: z.string(),
});

const listResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    posts: z.array(postSchema),
  }),
});

const createResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    post: postSchema,
  }),
});

const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

/**
 * @description Fetches all posts from the API (relative `/api` in dev via Vite proxy).
 * @returns Parsed post list, newest first from server.
 */
export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch("/api/posts");
  const json: unknown = await res.json();
  const parsed = listResponseSchema.safeParse(json);
  if (!parsed.success || !res.ok) {
    const err = errorResponseSchema.safeParse(json);
    const message = err.success ? err.data.error.message : "Failed to load posts";
    throw new Error(message);
  }
  return parsed.data.data.posts;
}

/**
 * @description Creates a post via POST /api/posts.
 * @param input Title and body from the form.
 * @returns Created post.
 */
export async function createPost(input: {
  title: string;
  body: string;
}): Promise<Post> {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json: unknown = await res.json();
  const parsed = createResponseSchema.safeParse(json);
  if (!parsed.success || !res.ok) {
    const err = errorResponseSchema.safeParse(json);
    const message = err.success ? err.data.error.message : "Failed to create post";
    throw new Error(message);
  }
  return parsed.data.data.post;
}
