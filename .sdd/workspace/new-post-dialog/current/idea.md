# Idea: new-post-dialog

## Raw Request

Replace the always-visible new-post box with a **New post** button; clicking opens a **popup/modal** to create a post.

## Normalized Summary

The feed page should lead with the post list and a primary action that opens a modal dialog containing the existing title/body form and publish flow.

## Initial Scope

- Header action: button labeled **New post** (opens dialog).
- Modal: MUI `Dialog` with title, form, error display, Cancel + Publish.
- Successful publish closes the modal and refreshes the feed.
- Empty-state copy updated to reference the button.

## Out of Scope

- Routing to a dedicated page, drafts, or multi-step wizard.

## Assumptions

- Material UI remains the UI stack; same API contract as `blog-feed-api`.

## Human Approval Status

- [x] Ready for implementation
