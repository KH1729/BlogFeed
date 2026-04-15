import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createLogger } from "../logger.js";
import { PostRepository } from "./postRepository.js";

describe("PostRepository", () => {
  let tempDir: string;

  beforeAll(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "blog-feed-repo-"));
  });

  afterAll(async () => {
    // Temp dir left for OS cleanup.
  });

  it("clearAllPosts writes an empty posts array", async () => {
    const file = path.join(tempDir, `clear-${Date.now()}.json`);
    await writeFile(
      file,
      JSON.stringify({
        posts: [
          {
            id: "x",
            title: "t",
            body: "b",
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      }),
      "utf8",
    );

    const logger = createLogger({ level: "silent" });
    const repository = new PostRepository(logger, file);
    await repository.clearAllPosts();

    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as { posts: unknown[] };
    expect(parsed.posts).toEqual([]);
  });

  it("updatePost replaces title and body and preserves createdAt", async () => {
    const file = path.join(tempDir, `update-${Date.now()}.json`);
    await writeFile(
      file,
      JSON.stringify({
        posts: [
          {
            id: "pid-1",
            title: "Old",
            body: "Old body",
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      }),
      "utf8",
    );

    const logger = createLogger({ level: "silent" });
    const repository = new PostRepository(logger, file);
    const updated = await repository.updatePost("pid-1", { title: "New", body: "New body" });

    expect(updated).not.toBeNull();
    expect(updated?.title).toBe("New");
    expect(updated?.body).toBe("New body");
    expect(updated?.createdAt).toBe("2026-01-01T00:00:00.000Z");

    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as {
      posts: Array<{ title: string; body: string; createdAt: string }>;
    };
    expect(parsed.posts[0]?.title).toBe("New");
  });

  it("updatePost returns null when id is missing", async () => {
    const file = path.join(tempDir, `update-null-${Date.now()}.json`);
    await writeFile(file, JSON.stringify({ posts: [] }), "utf8");

    const logger = createLogger({ level: "silent" });
    const repository = new PostRepository(logger, file);
    const updated = await repository.updatePost("missing", { title: "A", body: "B" });

    expect(updated).toBeNull();
  });
});
