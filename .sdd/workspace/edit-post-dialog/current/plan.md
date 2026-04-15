# Plan: edit-post-dialog

## Execution Strategy

- Approach: **sequential**
- Estimated workers: **1**
- Estimated validators: **1**

## Work Phases

### Phase 1: Backend — update API

- **Goal:** Persist post updates and expose `PATCH /api/posts/:id` with validation and tests.
- **Tasks:** E-001, E-002, E-003, E-004
- **Dependencies:** none
- **Validation checkpoint:** yes (integration tests pass)

### Phase 2: Client — edit UI

- **Goal:** Edit button, dialog, form wiring, API client, and component tests.
- **Tasks:** E-005, E-006, E-007, E-008, E-009
- **Dependencies:** Phase 1 complete (or E-005 can stub; prefer API ready first)
- **Validation checkpoint:** yes (Vitest client + server)

## Dependency Map

| Task | Depends On | Blocking? |
|------|------------|-----------|
| E-002 | E-001 | yes |
| E-003 | E-002 | yes |
| E-004 | E-003 | yes |
| E-005 | — (parallelizable after spec) | no — needs E-003 for E2E confidence |
| E-006 | E-005 partial | E-005 provides types/schemas client-side |
| E-007 | E-006 | yes |
| E-008 | E-007 | yes |
| E-009 | E-008 | yes |

**Recommended order:** E-001 → E-002 → E-003 → E-004 → E-005 → E-006 → E-007 → E-008 → E-009.

## Integration Approach

Implement server first so `updatePost` and integration tests are green before wiring `App` submit handlers.

## Rollout Order

1. Schemas + repository `updatePost`
2. Route + README + `app.integration.test.ts`
3. `api.ts` `updatePost`
4. `NewPostForm` extensions
5. `EditPostDialog`
6. `PostCard` + `App`
7. Tests (`EditPostDialog.test.tsx`, adjust `PostCard` if needed)

## Risks / Coordination Notes

- Single worker keeps file conflicts minimal; do not parallelize two edits to `NewPostForm` without coordination.
