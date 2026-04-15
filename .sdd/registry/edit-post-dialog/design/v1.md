# Design: edit-post-dialog

## Design Summary

Add **`PATCH /api/posts/:id`** with a shared zod body schema (same fields as create), **`PostRepository.updatePost`**, and client **`updatePost`**. In the UI, **`PostCard`** exposes a text **Edit** button (outlined, secondary to content) that calls back to **`App`**, which holds `editingPost: Post | null` and renders **`EditPostDialog`** alongside **`NewPostDialog`**. **`NewPostForm`** gains optional props so one component serves both flows: default values for edit, custom submit label (**Save** vs **Publish**), optional `resetAfterSuccessfulSubmit` (false for edit so closing the dialog does not rely on empty reset), and distinct `fieldIdPrefix` / labels for accessibility. After a successful update, **`App`** calls **`loadPosts()`** to refresh the list. Only one dialog is open at a time in practice; separate open flags prevent overlap.

## Architecture Impact

- Impact level: **medium**
- New components: **`EditPostDialog`** (mirror of `NewPostDialog` shell)
- Modified: **`NewPostForm`**, **`PostCard`**, **`App`**, **`client/src/lib/api.ts`**, **`server/src/routes/postsRoutes.ts`**, **`server/src/schemas/postSchemas.ts`**, **`server/src/services/postRepository.ts`**, **`server/README.md`**, **`server/src/app.integration.test.ts`**

## Components / Modules Affected

| Component | Change Type | Description |
|-----------|---------------|-------------|
| `PostCard` | modified | `onEdit` callback prop; header row with title + **Edit** `Button` |
| `NewPostForm` | modified | Optional `defaultValues`, `submitLabel`, `resetAfterSuccessfulSubmit`, `fieldIdPrefix`; `useEffect` + `reset()` when `defaultValues` change |
| `EditPostDialog` | new | MUI `Dialog` titled “Edit post”, error `Alert`, embeds `NewPostForm` with edit props |
| `App` | modified | State for edit dialog + errors + submitting; `updatePost` + `loadPosts`; wire `PostCard` |
| `api.ts` | modified | `updatePostSchema`, `updatePost(id, input)` |
| `postsRoutes` | modified | `PATCH /:id` handler |
| `postSchemas` | modified | Export shared `postTitleBodySchema` or reuse `createPostBodySchema` for PATCH body |
| `PostRepository` | modified | `updatePost(id, input)` with write-chain |

## Interfaces / APIs

### PATCH /api/posts/:id

- **Method:** `PATCH`
- **Input:** JSON `{ title: string, body: string }` (same validation as POST create)
- **Output (200):** `{ success: true, data: { post: Post } }` — `createdAt` unchanged
- **Errors:** `400` `VALIDATION_ERROR`; `404` e.g. `NOT_FOUND`; `500` internal

### Client `updatePost`

- **Signature:** `(id: string, input: { title: string; body: string }) => Promise<Post>`
- **Parsing:** zod success/error envelopes matching `createPost`

## Data Flow

1. User clicks **Edit** on `PostCard` → `App` sets `editingPost` and opens `EditPostDialog`.
2. `NewPostForm` receives `defaultValues` from `editingPost`; `reset()` syncs when post changes.
3. Submit → `updatePost` → `PATCH` → repository updates JSON file → returns `Post`.
4. `App` runs `loadPosts()`, clears error, closes dialog.

## Data Model / Schema Changes

| Entity | Change | Fields |
|--------|--------|--------|
| `Post` | none | Still `id`, `title`, `body`, `createdAt` unchanged on update |

## Security Considerations

- No auth in scope; any client can edit any post id (same trust model as create). Input validated server-side.

## Observability Considerations

- Log validation failures and 404 on update at `warn` like create (structured logger).

## Testing Strategy

- **Integration:** `PATCH` success updates list on subsequent `GET`; `400` invalid body; `404` unknown id.
- **Unit:** `PostRepository.updatePost` (new test file or extend `postRepository.test.ts` if present).
- **Client:** `EditPostDialog` test (render with post, submit label **Save**) or `PostCard` fires `onEdit` — align with existing `NewPostDialog.test.tsx` depth.

## Rollout / Migration Notes

- No migration; existing JSON file shape unchanged.

## Risks / Tradeoffs

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Form default values stale if `editingPost` changes while open | Low | Wrong save | Key `EditPostDialog` with `post.id` or reset on `editingPost` change |
| `NewPostForm` complexity | Low | Harder maintain | Keep props minimal; document in JSDoc |

## Resolved open question (from spec)

- **Edit control:** Use **text** “Edit” as `Button` `size="small"` `variant="outlined"` in the card header row next to the title (wrap title + button in `Stack` direction row). Ensures visible label without extra icon dependency.
