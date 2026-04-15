# Summary: tasks — edit-post-dialog

## Phase

tasks

## What Was Produced

- `tasks.md` with E-001–E-009: schemas, repository, route, README/tests, client API, form, dialog, PostCard/App, final sweep.

## Key Decisions

1. **E-006** (`NewPostForm`) can start after E-001 conceptually but safest after backend contract locked (E-003).
2. **E-009** gates completion of implementation phase.

## Risks / Open Issues

- If E-006 changes default field ids, update any tests that query `#new-post-title`.

## What the Next Agent Must Know

- Worker **W1** takes all tasks in order per `worker-assignments.json`.
