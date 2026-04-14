# Idea: empty-feed-first-post

## Raw Request

/sdd-build-feature — on first run, when there are no posts, automatically the new post pop up should open with a message explaining that there are no posts in the feed and that the user should write the first post.

## Normalized Summary

When the feed loads successfully and returns zero posts, the app should automatically open the existing new-post dialog once. The dialog should include a short informational message that the feed is empty and invite the user to create the first post. Opening the dialog manually via the header button should not show that empty-feed message.

## Initial Scope

- After initial load succeeds with `posts.length === 0`, open `NewPostDialog` automatically (once per page load).
- Show an info-level message inside the dialog explaining the empty feed and prompting the first post.
- Manual "New post" opens the same dialog without the empty-feed intro.
- No API or server changes.

## Out of Scope

- Persisting "user has seen empty prompt" across sessions (localStorage).
- Auto-opening again if the user closes the dialog without posting (same visit: do not reopen).

## Assumptions

- "First run" means the first time the empty state is observed after a successful load in the current page session.

## Constraints

- Reuse existing `NewPostDialog` and form; keep bundle small.

## Human Approval Status

- [ ] Idea reviewed by human developer
- [ ] Scope confirmed
- [ ] Ready to proceed to Spec phase
