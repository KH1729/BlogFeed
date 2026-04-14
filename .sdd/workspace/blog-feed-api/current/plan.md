# Plan: blog-feed-api

## Milestones

1. Scaffold `server/` package (TypeScript, Express, tooling).
2. Implement `PostRepository` and JSON schema on disk.
3. Wire routes, middleware, and env (CORS, port).
4. Add integration tests and README API section.

## Risks

- Concurrent writes: mitigated by serialized write queue on the repository.

## Dependencies

npm packages: express, zod, pino, cors, helmet, express-rate-limit; dev: vitest, supertest, tsx, typescript.
