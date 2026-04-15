import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

import type { Logger } from "pino";

import type { CreatePostInput, Post } from "../types/post.js";

const SERVER_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);

interface PostsFileShape {
  posts: Post[];
}

/**
 * @description Reads and writes the posts JSON file with simple in-process locking.
 */
export class PostRepository {
  private readonly filePath: string;
  private writeChain: Promise<void> = Promise.resolve();

  constructor(
    private readonly logger: Logger,
    dataFilePath?: string,
  ) {
    this.filePath =
      dataFilePath ?? path.join(SERVER_ROOT, "data", "posts.json");
  }

  /**
   * @description Loads all posts from disk, newest first.
   * @returns Ordered post list.
   */
  async listPosts(): Promise<Post[]> {
    const raw = await readFile(this.filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    const data = this.parseFile(parsed);
    return [...data.posts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  /**
   * @description Replaces the posts file with an empty list (e.g. on server shutdown).
   */
  async clearAllPosts(): Promise<void> {
    const empty: PostsFileShape = { posts: [] };
    this.writeChain = this.writeChain.then(() =>
      writeFile(this.filePath, `${JSON.stringify(empty, null, 2)}\n`, "utf8"),
    );
    await this.writeChain;
    this.logger.info({}, "posts_file_cleared");
  }

  async createPost(input: CreatePostInput): Promise<Post> {
    const post: Post = {
      id: randomUUID(),
      title: input.title,
      body: input.body,
      createdAt: new Date().toISOString(),
    };

    this.writeChain = this.writeChain.then(() => this.persistAppended(post));
    await this.writeChain;
    return post;
  }

  /**
   * @description Updates title and body for an existing post; preserves id and createdAt.
   * @param id Post identifier.
   * @param input Trimmed title and body.
   * @returns Updated post, or null if no post matches id.
   */
  async updatePost(id: string, input: CreatePostInput): Promise<Post | null> {
    const resultPromise = this.writeChain.then(async (): Promise<Post | null> => {
      const raw = await readFile(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as unknown;
      const data = this.parseFile(parsed);
      const idx = data.posts.findIndex((p) => p.id === id);
      if (idx === -1) {
        return null;
      }
      const existing = data.posts[idx];
      if (!existing) {
        return null;
      }
      const updated: Post = {
        ...existing,
        title: input.title,
        body: input.body,
      };
      data.posts[idx] = updated;
      await writeFile(this.filePath, `${JSON.stringify({ posts: data.posts }, null, 2)}\n`, "utf8");
      this.logger.debug({ postId: id }, "post_updated");
      return updated;
    });
    this.writeChain = resultPromise.then(() => undefined);
    return resultPromise;
  }

  private parseFile(parsed: unknown): PostsFileShape {
    if (!parsed || typeof parsed !== "object" || !("posts" in parsed)) {
      throw new Error("Invalid posts file shape");
    }
    const postsUnknown = (parsed as { posts: unknown }).posts;
    if (!Array.isArray(postsUnknown)) {
      throw new Error("Invalid posts array");
    }
    const posts: Post[] = [];
    for (const item of postsUnknown) {
      if (!this.isPost(item)) {
        throw new Error("Invalid post entry in file");
      }
      posts.push(item);
    }
    return { posts };
  }

  private isPost(value: unknown): value is Post {
    if (!value || typeof value !== "object") return false;
    const o = value as Record<string, unknown>;
    return (
      typeof o["id"] === "string" &&
      typeof o["title"] === "string" &&
      typeof o["body"] === "string" &&
      typeof o["createdAt"] === "string"
    );
  }

  private async persistAppended(post: Post): Promise<void> {
    const raw = await readFile(this.filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    const data = this.parseFile(parsed);
    data.posts.push(post);
    const out: PostsFileShape = { posts: data.posts };
    await writeFile(this.filePath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
    this.logger.debug({ postId: post.id }, "post_persisted");
  }
}
