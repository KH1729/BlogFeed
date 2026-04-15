# Handoff: Idea Agent → Spec Agent

## Feature

edit-post-dialog

## From

Idea Agent (SDD pipeline)

## To

Spec Agent

## Completed Work

- Artifact: `.sdd/workspace/edit-post-dialog/current/idea.md`
- Summary: `.sdd/summaries/edit-post-dialog/idea-summary.md`

## Key Decisions

1. Modal-based edit aligned with the existing new-post dialog UX.
2. Include API + persistence for update in feature scope.

## Constraints to Preserve

- Manual approval gates; no scope expansion without human sign-off.
- Express/zod/MUI and existing error shapes on the API.

## Risks / Open Issues

- No `updatePost` in `client/src/lib/api.ts` and no obvious PATCH in server — spec must define endpoint contract and validation.

## Recommended Next Action

Draft `spec.md` with user stories, functional requirements (UI + API), acceptance criteria, and edge cases (concurrent edit, not found, validation errors).
