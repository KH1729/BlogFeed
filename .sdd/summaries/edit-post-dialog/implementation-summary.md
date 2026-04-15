# Summary: implementation — edit-post-dialog

## Phase

implementation

## What Was Produced

- **Server:** `postTitleBodySchema` / `updatePostBodySchema`, `PostRepository.updatePost`, `PATCH /api/posts/:id`, README, integration + repository tests.
- **Client:** `updatePost` in `api.ts` (+ MSW tests), extended `NewPostForm`, `EditPostDialog`, `PostCard` + `App` wiring, `EditPostDialog.test.tsx`.
- **Verification:** `npm test` in `server` and `client` (all green).

## Key Decisions

1. `EditPostDialog` mounts only when `editingPost !== null`; `open` always true when mounted.
2. `NewPostForm` uses `key={post.id}` in dialog for stable remount per post.

## Risks / Open Issues

- None blocking.

## What the Next Agent Must Know

- Run validation against `spec.md` / `design.md` and manual smoke: edit post, refresh list.
