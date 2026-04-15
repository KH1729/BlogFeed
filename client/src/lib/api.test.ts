import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { createPost, fetchPosts, updatePost } from "./api.js";

const server = setupServer();

describe("api", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
  });
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => {
    server.close();
  });

  it("fetchPosts returns posts when the API succeeds", async () => {
    server.use(
      http.get("/api/posts", () =>
        HttpResponse.json({
          success: true,
          data: {
            posts: [
              {
                id: "a",
                title: "Hi",
                body: "There",
                createdAt: "2026-04-14T10:00:00.000Z",
              },
            ],
          },
        }),
      ),
    );

    const posts = await fetchPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0]?.title).toBe("Hi");
  });

  it("fetchPosts throws when the API returns an error shape", async () => {
    server.use(
      http.get("/api/posts", () =>
        HttpResponse.json(
          { success: false, error: { code: "X", message: "nope" } },
          { status: 400 },
        ),
      ),
    );

    await expect(fetchPosts()).rejects.toThrow(/nope/);
  });

  it("createPost returns the created post", async () => {
    server.use(
      http.post("/api/posts", async ({ request }) => {
        const body = (await request.json()) as { title?: string; body?: string };
        return HttpResponse.json(
          {
            success: true,
            data: {
              post: {
                id: "new-id",
                title: body.title ?? "",
                body: body.body ?? "",
                createdAt: "2026-04-14T10:00:00.000Z",
              },
            },
          },
          { status: 201 },
        );
      }),
    );

    const post = await createPost({ title: "T", body: "B" });
    expect(post.id).toBe("new-id");
  });

  it("updatePost returns the updated post", async () => {
    server.use(
      http.patch("/api/posts/:id", async ({ params, request }) => {
        const body = (await request.json()) as { title?: string; body?: string };
        return HttpResponse.json({
          success: true,
          data: {
            post: {
              id: params.id as string,
              title: body.title ?? "",
              body: body.body ?? "",
              createdAt: "2026-04-14T10:00:00.000Z",
            },
          },
        });
      }),
    );

    const post = await updatePost("abc", { title: "T2", body: "B2" });
    expect(post.id).toBe("abc");
    expect(post.title).toBe("T2");
  });

  it("updatePost throws when the API returns an error shape", async () => {
    server.use(
      http.patch("/api/posts/:id", () =>
        HttpResponse.json(
          { success: false, error: { code: "NOT_FOUND", message: "missing" } },
          { status: 404 },
        ),
      ),
    );

    await expect(updatePost("x", { title: "A", body: "B" })).rejects.toThrow(/missing/);
  });
});
