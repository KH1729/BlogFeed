# Summary: spec — edit-post-dialog

## Phase

spec

## What Was Produced

- `spec.md` defining FRs for per-post Edit, modal pre-fill, `PATCH /api/posts/:id` with zod body matching create limits, 200/400/404/500 behavior, client `updatePost`, and tests.

## Key Decisions

1. **PATCH** for partial field updates with body `{ title, body }` (same shape as create).
2. Preserve **`createdAt`** on update; only title/body change.
3. Edit dialog title must differ from “New post”; loading close-guard matches create.

## Risks / Open Issues

- Repository needs `updatePost(id, input)` with file persistence; must integrate with existing write chain.
- Open question: Edit button presentation left to design phase.

## What the Next Agent Must Know

- Read `server/src/routes/postsRoutes.ts`, `postSchemas.ts`, `postRepository.ts`, `client/src/App.tsx`, `PostCard.tsx`, `NewPostForm.tsx` for boundaries.
