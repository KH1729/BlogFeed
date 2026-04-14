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
});
