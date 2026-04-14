# Idea: blog-feed-api

## Raw Request

Express serves posts from a JSON file for the BlogFeed project; REST API for list and create with validation and consistent JSON envelopes.

## Normalized Summary

Provide a Node.js Express HTTP API that persists blog posts in a JSON file on disk, exposes endpoints for listing and creating posts, and follows project Express conventions (zod validation, async safety, security middleware).

## Initial Scope

- GET `/api/posts` returning posts (newest first).
- POST `/api/posts` with `{ title, body }`; server assigns `id` and `createdAt`.
- JSON file storage under `server/data/posts.json`.
- Consistent `{ success, data }` / `{ success, error }` responses.

## Out of Scope

- Authentication, editing, deleting posts.
- Database or external storage.

## Assumptions

- Single-node usage; file locking via serialized writes is sufficient.

## Constraints

- Must align with `.cursor/rules/project-stack-node-js-express.mdc`.

## Human Approval Status

- [x] Idea reviewed by human developer
- [x] Scope confirmed
- [x] Ready to proceed to Spec phase
