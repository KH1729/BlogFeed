# Spec: edit-post-dialog

## Background / Context

The feed lists posts from `GET /api/posts` and creates posts via `POST /api/posts` through a modal (`NewPostDialog` + `NewPostForm`). Users need to correct mistakes or update content without creating a duplicate post.

## Problem Statement

There is no way to change an existing post’s title or body from the UI, and no update endpoint on the server.

## Goals

1. From each post in the feed, open an edit dialog pre-filled with that post’s fields.
2. Save changes through a validated API and show the updated post in the list.
3. Match create-flow UX: modal, errors in-dialog, loading guardrails, accessible labeling.

## Non-Goals

1. Optimistic UI beyond a standard refresh or list replace after success.
2. Tracking “last edited” metadata or version history.
3. Batch edit or inline editing without a dialog.

## User Stories / Use Cases

### US-1: Open edit from a post

**As a** reader/author, **I want to** click **Edit** on a post, **so that** I can change its title and body in a focused modal.

### US-2: Save valid changes

**As a** user, **I want to** submit the form, **so that** the server persists changes and the feed shows the updated content.

### US-3: Handle failures

**As a** user, **I want to** see validation or server errors in the dialog, **so that** I can fix input or retry without losing context unexpectedly.

## Functional Requirements

### FR-1: Edit entry point

- Each post row/card exposes a visible **Edit** control tied to that post’s `id`.
- Activating it opens the edit dialog with `title` and `body` initialized from that post.

### FR-2: Edit dialog behavior

- Dialog title distinguishes edit from create (e.g. “Edit post”).
- Form fields and validation rules match create: trimmed title/body, required non-empty, max lengths consistent with server (`title` max 500, `body` max 50,000 — same as `createPostBodySchema`).
- **Cancel** closes without persisting.
- While a save request is in flight, backdrop/Escape close is disabled (same pattern as create).
- Server or client errors display inside the dialog (e.g. `Alert`).

### FR-3: API — update post

- New route: **`PATCH /api/posts/:id`** (preferred) or **`PUT /api/posts/:id`** with JSON body `{ title: string, body: string }` using the same field rules as POST create.
- **200** response: `{ success: true, data: { post: Post } }` with updated `Post` (`id` and `createdAt` unchanged unless spec elsewhere requires otherwise; **default: preserve `createdAt`**).
- **400** validation: existing error shape with `code` / `message`.
- **404** if `id` does not exist: `{ success: false, error: { code, message } }` with appropriate HTTP status.
- **500** on unexpected errors: consistent with existing routes.

### FR-4: Client integration

- Typed client function (e.g. `updatePost`) parses success/error responses with zod (mirroring `createPost`).
- After successful update, the feed reflects changes (re-fetch list or merge updated post into state).

## Non-Functional Requirements

### NFR-1: Consistency

Server validation uses zod schemas; no duplicate magic numbers — share limits with create schema or a shared partial.

### NFR-2: Testing

- Integration or route test: happy path update + validation error + not found.
- Component test: edit dialog shows initial values and submit path (or covered at parent level per project patterns).

## Constraints

- Express async handlers wrapped; no `console.log` in production paths.
- Client: no `any`; existing stack (MUI, react-hook-form + zod where used).

## Assumptions

- Single user / no auth: no ownership checks beyond “post exists.”
- Post `id` in URL path is the canonical identifier.

## Edge Cases

| Edge Case | Expected Behavior |
|-----------|-------------------|
| Invalid `id` format (if applicable) | 400 or 404 per implementation; must not crash |
| Post deleted between open and save | 404; show error in dialog |
| Empty title/body after trim | 400 validation error |
| Network failure | Error surfaced in dialog; list unchanged |

## Acceptance Criteria

- [ ] **Edit** opens dialog with correct post content for multiple posts in the list.
- [ ] Successful save updates that post in the feed without duplicate entries.
- [ ] `PATCH /api/posts/:id` documented in `server/README.md` with request/response shapes.
- [ ] Tests cover update route (happy + error) and UI behavior for edit flow at level consistent with `NewPostDialog` tests.

## Open Questions

1. **Button style:** Text “Edit” vs icon-only — defer to design phase (default: text or icon+`aria-label` for a11y).
