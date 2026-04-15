# Summary: design — edit-post-dialog

## Phase

design

## What Was Produced

- `design.md` covering PATCH API, repository update, `updatePost` client, `EditPostDialog`, extended `NewPostForm`, `PostCard` + `App` wiring, and tests.

## Key Decisions

1. **Edit** = small outlined text button in `PostCard` header row (spec open question closed).
2. **Single form component** with props for edit vs create rather than duplicating fields.
3. **Refresh** = `loadPosts()` after success (no optimistic merge).

## Risks / Open Issues

- Stabilize form when `editingPost` changes via `key={post.id}` on dialog content or `reset` in `useEffect`.

## What the Next Agent Must Know

- Implement `PostRepository.updatePost` using existing `writeChain` pattern; read-modify-write JSON array by `id`.
