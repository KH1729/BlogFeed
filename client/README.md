# Blog Feed Client

Vite + React SPA (Material UI) that lists posts and submits new ones to the Express API.

## Run

From repo root (with the API running or started together):

```bash
npm install
npm run dev -w blog-feed-client
```

The dev server proxies `/api` to `http://127.0.0.1:3001` (see `vite.config.ts`).

## Build

```bash
npm run build -w blog-feed-client
```

Serve `dist/` behind any static host; production deployments should set the API URL if the API is not same-origin (extend `src/lib/api.ts` to use `import.meta.env` when needed).
