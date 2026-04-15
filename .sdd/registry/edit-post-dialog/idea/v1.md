# Idea: edit-post-dialog

## Raw Request

Add edit button. When clicking on it the post pop up window opens with the relevant post that needs to be edited.

## Normalized Summary

Each post in the feed should expose an **Edit** control that opens the same modal-style dialog pattern used for creating posts, pre-filled with that post’s title and body, so the user can change and save updates.

## Initial Scope

- **Per-post UI:** An **Edit** action (button or icon button) on each post card (or equivalent row) that is clearly associated with that post.
- **Dialog:** Reuse the existing popup/modal pattern (MUI `Dialog` + form) so behavior matches **New post** (close on cancel, loading state, errors).
- **Pre-fill:** Opening edit loads the selected post’s `id`, `title`, and `body` into the form.
- **Persist:** Submitting applies changes on the server and refreshes the feed (or updates local state) so the list reflects the edit.
- **API:** Server support to update a post by id (e.g. `PATCH` or `PUT` for `/api/posts/:id`) with validation consistent with create, unless an endpoint already exists.

## Out of Scope

- Rich text / markdown editor, attachments, or collaborative editing.
- Edit history, audit log, or “edited at” display (unless trivially added with the same change).
- Deleting posts from the same dialog (separate feature unless specified).
- Routing to a full-page editor instead of the modal.

## Assumptions

- Material UI remains the stack; patterns align with `NewPostDialog` / `NewPostForm`.
- Post identity is `Post.id` (string); same validation rules as create for title/body.
- The dev proxy and API base (`/api`) stay as today.

## Constraints

- Manual SDD mode: no phase advance without human approval.
- Follow project rules: typed API client, zod validation on the server, consistent `{ success, data | error }` responses.

## Human Approval Status

- [x] Idea reviewed by human developer
- [x] Scope confirmed
- [x] Ready to proceed to Spec phase
