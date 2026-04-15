# Tasks: edit-post-dialog

## Task List

### E-001: Shared POST/PATCH body schema

- **Scope:** Reuse or extract shared zod schema for `{ title, body }` in `postSchemas.ts`; keep `createPostBodySchema` compatible (alias or `z.infer` same shape).
- **Inputs:** `server/src/schemas/postSchemas.ts`, approved design.
- **Dependencies:** none
- **Expected Output:** Exported schema used by POST and PATCH validators.
- **Definition of Done:** POST behavior unchanged; no duplicate magic numbers.
- **Validation Notes:** Run existing server tests.

### E-002: PostRepository.updatePost

- **Scope:** `updatePost(id, input): Promise<Post | null>` or throw; find post by `id`, replace `title`/`body`, preserve `id`/`createdAt`; use `writeChain`; persist JSON.
- **Inputs:** `postRepository.ts`, design.
- **Dependencies:** E-001 (types only — `CreatePostInput`-like body)
- **Expected Output:** Method + unit tests in `postRepository.test.ts` (or new cases).
- **Definition of Done:** Unknown id returns null or documented behavior matching route 404.
- **Validation Notes:** Test file isolation with temp JSON file.

### E-003: PATCH /api/posts/:id route

- **Scope:** Register `PATCH /:id` in `postsRoutes.ts`; validate body; call repository; 200/400/404; logger on validation fail.
- **Inputs:** `postsRoutes.ts`, `asyncHandler`, design.
- **Dependencies:** E-002
- **Expected Output:** Route matches spec error shapes.
- **Definition of Done:** Supertest integration tests: success, 400 empty title, 404 bad id.
- **Validation Notes:** Match `POST` error structure.

### E-004: Server README + integration tests

- **Scope:** Document `PATCH` in `server/README.md`; add cases to `app.integration.test.ts` per E-003.
- **Inputs:** Existing README pattern.
- **Dependencies:** E-003
- **Expected Output:** README section; passing integration suite.
- **Definition of Done:** Copy-paste curl/example optional; method/path/body/response documented.
- **Validation Notes:** CI green.

### E-005: Client api.updatePost

- **Scope:** `updatePost` in `client/src/lib/api.ts` with zod response parsing mirroring `createPost`; handle 404 message.
- **Inputs:** `api.ts`, spec envelopes.
- **Dependencies:** E-003 (contract stable)
- **Expected Output:** Exported function, typed `Post` return.
- **Definition of Done:** No `any`; errors throw `Error` with message.
- **Validation Notes:** Manual or unit test if client has api tests.

### E-006: Extend NewPostForm for edit mode

- **Scope:** Props: `defaultValues`, `submitLabel`, `resetAfterSuccessfulSubmit` (default true), `fieldIdPrefix` (default `new-post`); `useEffect` + `reset(defaultValues)` when defaults change; submit button text from `submitLabel`.
- **Inputs:** `NewPostForm.tsx`, design.
- **Dependencies:** none (parallel with backend after E-001 conceptually)
- **Expected Output:** Create flow unchanged; documented JSDoc on new props.
- **Definition of Done:** Existing form tests still pass; adjust if ids change.
- **Validation Notes:** Run `NewPostForm` tests.

### E-007: Add EditPostDialog

- **Scope:** New file `EditPostDialog.tsx` — Dialog title “Edit post”, error alert, `NewPostForm` with edit props, `key={post.id}`, aria ids.
- **Inputs:** `NewPostDialog.tsx` as template.
- **Dependencies:** E-006
- **Expected Output:** Exported component + tests `EditPostDialog.test.tsx`.
- **Definition of Done:** Test renders title Save, mocks onSubmit.
- **Validation Notes:** RTL patterns match `NewPostDialog.test.tsx`.

### E-008: PostCard + App wiring

- **Scope:** `PostCard` — `onEdit: () => void`; header `Stack` with title + Edit button. `App` — state `editingPost`, `isEditOpen`, `editFormError`, `isEditSubmitting`; render `EditPostDialog`; pass `onEdit` to cards; on success `loadPosts` + close.
- **Inputs:** `App.tsx`, `PostCard.tsx`.
- **Dependencies:** E-005, E-007
- **Expected Output:** End-to-end manual path works against running server.
- **Definition of Done:** Edit updates visible post after save.
- **Validation Notes:** Smoke: two posts, edit one, other unchanged.

### E-009: Final test sweep

- **Scope:** Run `npm test` / `vitest` in client and server; fix regressions; optional `PostCard` test for `onEdit` fire.
- **Inputs:** Full repo test scripts.
- **Dependencies:** E-008
- **Expected Output:** All tests green.
- **Definition of Done:** No skipped tests for this feature.
- **Validation Notes:** Document in implementation notes if anything deferred.

## Task index

| ID | Summary | Status |
|----|---------|--------|
| E-001 | Shared body schema | pending |
| E-002 | Repository updatePost | pending |
| E-003 | PATCH route | pending |
| E-004 | README + integration tests | pending |
| E-005 | Client updatePost | pending |
| E-006 | NewPostForm edit props | pending |
| E-007 | EditPostDialog + test | pending |
| E-008 | PostCard + App | pending |
| E-009 | Test sweep | pending |
