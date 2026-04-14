import { createServer } from "node:http";

import type { Logger } from "pino";

import { createApp } from "./app.js";
import { createLogger } from "./logger.js";
import { PostRepository } from "./services/postRepository.js";

const DEFAULT_PORT = 3001;

let isShuttingDown = false;

/**
 * @description Stops the HTTP server, optionally clears persisted posts, then exits.
 */
async function shutdown(
  signal: NodeJS.Signals,
  logger: Logger,
  repository: PostRepository,
  server: ReturnType<typeof createServer>,
): Promise<void> {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;
  logger.info({ signal }, "shutdown_received");

  try {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (err: unknown) {
    logger.error({ err }, "server_close_failed");
  }

  const skipClear = process.env["SKIP_POSTS_CLEAR_ON_SHUTDOWN"] === "1";
  if (skipClear) {
    logger.info({}, "posts_clear_skipped");
    process.exit(0);
    return;
  }

  try {
    await repository.clearAllPosts();
    logger.info({}, "posts_cleared_on_shutdown");
  } catch (err: unknown) {
    logger.error({ err }, "posts_clear_failed");
    process.exitCode = 1;
  }

  process.exit(process.exitCode ?? 0);
}

/**
 * @description Starts the HTTP server.
 */
async function main(): Promise<void> {
  const logger = createLogger();
  const dataPath = process.env["POSTS_DATA_PATH"];
  const repository = new PostRepository(logger, dataPath);
  const app = createApp({ logger, repository });
  const port = Number(process.env["PORT"] ?? DEFAULT_PORT);

  const server = createServer(app);

  server.listen(port, () => {
    logger.info({ port }, "server_listening");
  });

  const onSignal = (signal: NodeJS.Signals) => {
    void shutdown(signal, logger, repository, server);
  };

  process.once("SIGINT", () => {
    onSignal("SIGINT");
  });
  process.once("SIGTERM", () => {
    onSignal("SIGTERM");
  });
}

void main().catch((err: unknown) => {
  const logger = createLogger();
  logger.error({ err }, "server_failed_to_start");
  process.exitCode = 1;
});
