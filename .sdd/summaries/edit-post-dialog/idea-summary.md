# Summary: idea — edit-post-dialog

## Phase

idea

## What Was Produced

- Idea artifact at `.sdd/workspace/edit-post-dialog/current/idea.md` capturing: Edit control per post, modal pre-filled with that post, save flow, and server update API if missing.

## Key Decisions

1. Reuse the existing new-post dialog/form pattern for consistency rather than a separate full-page editor.
2. Treat backend update (`PATCH`/`PUT` by post id) as in scope because the client currently only has `createPost` / `fetchPosts`.

## Risks / Open Issues

- Server may need a new route and repository method; coordinate client + server in spec/design.
- Decide UX detail in spec: icon vs text button, placement on `PostCard`, and dialog title (“Edit post” vs “New post”).

## What the Next Agent Must Know

- Reference: `client/src/components/NewPostDialog.tsx`, `NewPostForm.tsx`, `PostCard.tsx`, `client/src/lib/api.ts`.
- `Post` type includes `id`, `title`, `body`, `createdAt`.
