# Spec: blog-feed-ui

## Goals

1. Fetch and display posts in reverse chronological order (as returned by API).
2. Submit new posts with title + body; show validation errors inline.
3. Surface load/create errors to the user.

## Functional Requirements

### FR-1: Feed

Render each post in a card with title, date, and body text.

### FR-2: Form

Use react-hook-form with zod resolver; trim inputs; match server length limits.

### FR-3: Networking

Use `fetch` to `/api/posts` (relative URL for Vite proxy).

## Acceptance Criteria

- Unit tests for API helpers (MSW) and form validation behavior (RTL).
- `npm run build` succeeds.
