# Design: blog-feed-api

## Architecture

Single Express app in `server/src`: `index.ts` boots HTTP; `app.ts` wires middleware and routes; `routes/postsRoutes.ts` defines `/api/posts`; `PostRepository` encapsulates file I/O.

## Components

| Module | Responsibility |
|--------|----------------|
| `PostRepository` | Read/parse JSON, append post, serialize writes (chain) |
| `createPostsRouter` | GET list, POST create with zod |
| `errorHandler` | Zod and unknown errors to JSON envelope |
| `createApp` | cors → helmet → rateLimit → json → routes → errorHandler |

## Trust Boundaries

All request bodies validated with zod before persistence.

## Observability

`GET /health` for liveness; structured logging via pino.

## Implementation Location

Production code lives in [`server/`](../../../../server) at repo root (not under `.sdd/workspace/.../outputs`).
