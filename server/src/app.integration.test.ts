import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import { createApp } from "./app.js";
import { createLogger } from "./logger.js";
import { PostRepository } from "./services/postRepository.js";

describe("createApp", () => {
  let tempDir: string;
  let postsFile: string;

  beforeAll(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "blog-feed-test-"));
    postsFile = path.join(tempDir, "posts.json");
    await writeFile(postsFile, JSON.stringify({ posts: [] }), "utf8");
  });

  afterAll(async () => {
    // Temp dir cleanup is optional; OS reclaims on reboot.
  });

  it("GET /api/posts returns an empty list initially", async () => {
    const logger = createLogger({ level: "silent" });
    const repository = new PostRepository(logger, postsFile);
    const app = createApp({ logger, repository });

    const res = await request(app).get("/api/posts").expect(200);

    expect(res.body).toEqual({ success: true, data: { posts: [] } });
  });

  it("POST /api/posts creates a post and GET returns it", async () => {
    const isolatedFile = path.join(tempDir, `posts-${Date.now()}.json`);
    await writeFile(isolatedFile, JSON.stringify({ posts: [] }), "utf8");

    const logger = createLogger({ level: "silent" });
    const repository = new PostRepository(logger, isolatedFile);
    const app = createApp({ logger, repository });

    const createRes = await request(app)
      .post("/api/posts")
      .send({ title: "Hello", body: "World" })
      .expect(201);

    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.post.title).toBe("Hello");
    expect(createRes.body.data.post.body).toBe("World");

    const listRes = await request(app).get("/api/posts").expect(200);
    expect(listRes.body.data.posts).toHaveLength(1);
    expect(listRes.body.data.posts[0].title).toBe("Hello");
  });

  it("POST /api/posts returns 400 when body is invalid", async () => {
    const isolatedFile = path.join(tempDir, `posts-invalid-${Date.now()}.json`);
    await writeFile(isolatedFile, JSON.stringify({ posts: [] }), "utf8");

    const logger = createLogger({ level: "silent" });
    const repository = new PostRepository(logger, isolatedFile);
    const app = createApp({ logger, repository });

    const res = await request(app)
      .post("/api/posts")
      .send({ title: "", body: "x" })
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("PATCH /api/posts/:id updates a post and preserves createdAt", async () => {
    const isolatedFile = path.join(tempDir, `posts-patch-${Date.now()}.json`);
    await writeFile(isolatedFile, JSON.stringify({ posts: [] }), "utf8");

    const logger = createLogger({ level: "silent" });
    const repository = new PostRepository(logger, isolatedFile);
    const app = createApp({ logger, repository });

    const createRes = await request(app)
      .post("/api/posts")
      .send({ title: "Hello", body: "World" })
      .expect(201);

    const postId = createRes.body.data.post.id as string;
    const createdAt = createRes.body.data.post.createdAt as string;

    const patchRes = await request(app)
      .patch(`/api/posts/${postId}`)
      .send({ title: "Hi", body: "There" })
      .expect(200);

    expect(patchRes.body.success).toBe(true);
    expect(patchRes.body.data.post.title).toBe("Hi");
    expect(patchRes.body.data.post.body).toBe("There");
    expect(patchRes.body.data.post.createdAt).toBe(createdAt);

    const listRes = await request(app).get("/api/posts").expect(200);
    expect(listRes.body.data.posts[0].title).toBe("Hi");
  });

  it("PATCH /api/posts/:id returns 400 when body is invalid", async () => {
    const isolatedFile = path.join(tempDir, `posts-patch-bad-${Date.now()}.json`);
    await writeFile(isolatedFile, JSON.stringify({ posts: [] }), "utf8");

    const logger = createLogger({ level: "silent" });
    const repository = new PostRepository(logger, isolatedFile);
    const app = createApp({ logger, repository });

    const res = await request(app)
      .patch("/api/posts/any-id")
      .send({ title: "", body: "x" })
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("PATCH /api/posts/:id returns 404 when id is unknown", async () => {
    const isolatedFile = path.join(tempDir, `posts-patch-404-${Date.now()}.json`);
    await writeFile(isolatedFile, JSON.stringify({ posts: [] }), "utf8");

    const logger = createLogger({ level: "silent" });
    const repository = new PostRepository(logger, isolatedFile);
    const app = createApp({ logger, repository });

    const res = await request(app)
      .patch("/api/posts/00000000-0000-4000-8000-000000000000")
      .send({ title: "A", body: "B" })
      .expect(404);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});
