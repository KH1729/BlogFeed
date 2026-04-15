# Blog Feed API

Express server that persists posts to `data/posts.json`.

## Run

```bash
npm install
npm run dev
```

Environment:

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default `3001`) |
| `CORS_ORIGIN` | Allowed browser origin (default `http://localhost:5173`) |
| `LOG_LEVEL` | Pino log level (default `info`) |
| `POSTS_DATA_PATH` | Override path to posts JSON (tests / advanced use) |
| `SKIP_POSTS_CLEAR_ON_SHUTDOWN` | Set to `1` to **not** delete all posts when the process exits (recommended with `tsx watch` so restarts do not wipe data). **`npm run dev` sets this automatically.** |

## Shutdown behavior

When the server process stops (**SIGINT** / **SIGTERM**), it writes an **empty** `posts` array to the JSON file unless `SKIP_POSTS_CLEAR_ON_SHUTDOWN=1`.

- **`npm start`** (production): posts are cleared on shutdown.
- **`npm run dev`**: the script sets `SKIP_POSTS_CLEAR_ON_SHUTDOWN=1` so file watchers do not erase posts on every restart. To clear posts when you stop the dev server, run without that variable, e.g. `SKIP_POSTS_CLEAR_ON_SHUTDOWN= tsx watch src/index.ts` (empty value) or unset the variable in your shell before starting.

## API

### `GET /health`

**Response:** `{ success: true, data: { status: "ok" } }`

### `GET /api/posts`

**Response:** `{ success: true, data: { posts: Post[] } }` — posts sorted newest first.

`Post`: `{ id: string, title: string, body: string, createdAt: string }` (ISO 8601).

### `POST /api/posts`

**Request body:** `{ title: string, body: string }` (JSON, trimmed; title max 500 chars, body max 50,000).

**Response (201):** `{ success: true, data: { post: Post } }`

**Errors:** `{ success: false, error: { code: string, message: string } }` — e.g. `400` validation, `500` internal.

### `PATCH /api/posts/:id`

**Request body:** `{ title: string, body: string }` — same validation as `POST /api/posts` (trimmed; title max 500 chars, body max 50,000).

**Response (200):** `{ success: true, data: { post: Post } }` — `id` and `createdAt` are unchanged; `title` and `body` reflect the update.

**Errors:** `{ success: false, error: { code, message } }` — `400` validation (`VALIDATION_ERROR`), `404` when no post matches `id` (`NOT_FOUND`), `500` internal.
