# Design: blog-feed-ui

## Structure

- `src/lib/api.ts` — typed fetch + zod parse of API envelopes.
- `src/components/PostCard.tsx` — presentational card.
- `src/components/NewPostForm.tsx` — form with RHF + zod.
- `src/App.tsx` — loads posts on mount, delegates create to API and refreshes list.

## Styling

Tailwind CSS v4 via `@tailwindcss/vite`.

## Implementation Location

Code in [`client/`](../../../../client) at repo root.
