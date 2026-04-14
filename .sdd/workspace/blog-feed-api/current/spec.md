# Spec: blog-feed-api

## Background / Context

The BlogFeed client needs a backend that stores posts durably without a database for the MVP.

## Problem Statement

Expose a small, safe HTTP API backed by a JSON file so the React client can list and create posts.

## Goals

1. List all posts sorted by creation time descending.
2. Create a post from title and body with server-generated id and timestamp.
3. Validate input and return consistent error shapes.

## Non-Goals

Auth, pagination, rich text, file uploads.

## User Stories

### US-1: List posts

**As a** reader, **I want to** fetch all posts, **so that** I can see the feed.

### US-2: Create post

**As a** author, **I want to** submit title and body, **so that** a new post appears in storage.

## Functional Requirements

### FR-1: Persistence

Posts are stored in `server/data/posts.json` as `{ posts: Post[] }`.

### FR-2: API contract

- `GET /api/posts` → `200`, `{ success: true, data: { posts } }`.
- `POST /api/posts` → `201`, `{ success: true, data: { post } }` on success.
- Validation failure → `400`, `{ success: false, error: { code, message } }`.

## Non-Functional Requirements

### NFR-1: Security

Helmet, CORS for dev origin, rate limiting, no logging of post body in error paths.

## Acceptance Criteria

- Integration tests cover happy path and one validation error.
- Server starts with `npm run dev` and reads/writes the JSON file.
