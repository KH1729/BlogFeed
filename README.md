# BlogFeed

Simple blog feed: **Express** serves posts from a JSON file; **React** (Vite) with **Material UI** renders cards and a new-post form.

## Layout

- [`server/`](server) — API (`GET`/`POST` `/api/posts`).
- [`client/`](client) — SPA.

## Quick start

```bash
npm install
npm run dev
```

This runs the API on port **3001** and the Vite app on **5173** with `/api` proxied to the server.

**Posts file:** On shutdown, the server **clears** `server/data/posts.json` unless `SKIP_POSTS_CLEAR_ON_SHUTDOWN=1` is set. The **`npm run dev`** script for the server sets that so `tsx watch` restarts do not wipe posts. **Production** (`npm start` in `server/`) clears posts when you stop the process. See [`server/README.md`](server/README.md).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | API + client concurrently |
| `npm test -w blog-feed-server` | Server integration tests |
| `npm test -w blog-feed-client` | Client unit tests |


