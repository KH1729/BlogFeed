# Summary: idea — empty-feed-first-post

## Phase

idea

## What Was Produced

- Idea artifact: auto-open new-post dialog once when the feed loads empty; show an in-dialog info message; manual open skips the message.

## Key Decisions

1. Auto-open runs once per page load when the first successful fetch returns zero posts.

## Risks / Open Issues

- None identified for this small UX change.

## What the Next Agent Must Know

- Implementation touches `App.tsx` and `NewPostDialog` (optional `introMessage` prop).
