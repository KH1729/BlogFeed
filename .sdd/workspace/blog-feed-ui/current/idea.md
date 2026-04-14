# Idea: blog-feed-ui

## Raw Request

React renders post cards and a New Post form (title + body) against the blog-feed-api, using Vite in `client/`.

## Normalized Summary

Build a Vite + React SPA that loads posts from `/api/posts`, displays them as cards, and creates posts via a validated form aligned with the API contract.

## Initial Scope

- Post list UI with card layout.
- New post form with title and body (react-hook-form + zod).
- Dev proxy to the Express API.

## Out of Scope

Next.js App Router; auth; editing/deleting posts.

## Assumptions

API from `blog-feed-api` is available at the proxied `/api` path during development.

## Human Approval Status

- [x] Idea reviewed
- [x] Ready for Spec
