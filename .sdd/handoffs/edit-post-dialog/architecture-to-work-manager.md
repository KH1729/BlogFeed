# Handoff: Architecture Agent → Work Manager Agent

## Feature

edit-post-dialog

## From

Architecture Agent

## To

Work Manager Agent

## Completed Work

- Artifact: `.sdd/workspace/edit-post-dialog/current/design.md`
- Summary: `.sdd/summaries/edit-post-dialog/design-summary.md`

## Key Decisions

1. Server: shared body schema, `PATCH /api/posts/:id`, `PostRepository.updatePost`.
2. Client: `EditPostDialog` + `NewPostForm` extensions + `PostCard.onEdit` + `App` state.
3. Tests: integration PATCH + repository + dialog-level test.

## Constraints to Preserve

- `createdAt` immutable on update; error shapes match existing API.

## Risks / Open Issues

- None blocking; coordinate task order: repo + route before client, or parallel after types/schemas.

## Recommended Next Action

Split into tasks: (1) schema + repository + route + README + integration tests, (2) api.ts + form/dialog + PostCard + App + component tests.
