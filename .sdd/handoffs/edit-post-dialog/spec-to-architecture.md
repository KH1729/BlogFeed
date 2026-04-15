# Handoff: Spec Agent → Architecture Agent

## Feature

edit-post-dialog

## From

Spec Agent

## To

Architecture Agent

## Completed Work

- Artifact: `.sdd/workspace/edit-post-dialog/current/spec.md`
- Summary: `.sdd/summaries/edit-post-dialog/spec-summary.md`

## Key Decisions

1. REST: `PATCH /api/posts/:id`, body `{ title, body }`, response `{ success: true, data: { post } }`.
2. Validation reuses create field rules (shared zod).
3. UI: edit trigger on each post; modal reuse with pre-filled form and distinct title.

## Constraints to Preserve

- Approved spec scope; no auth/ownership layer unless added in a later feature.
- `Post.createdAt` unchanged on update.

## Risks / Open Issues

- `PostRepository` currently append-only; design must specify atomic update in JSON file with existing locking pattern.

## Recommended Next Action

Produce `design.md`: components (`PostCard`, dialog/form reuse), `App` state for “editing post id”, repository `updatePost`, route registration, and test layout.
