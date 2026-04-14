# Validation: new-post-dialog

## Checks

| Check | Result | Evidence |
|-------|--------|----------|
| FR: button opens modal | PASS | `App.tsx`, `NewPostDialog.tsx` |
| FR: submit closes on success | PASS | `onSubmit` in `App.tsx` |
| FR: no backdrop close while submitting | PASS | `Dialog.onClose` guard |
| Tests | PASS | `npm test -w blog-feed-client` |
| No `any` | PASS | TypeScript strict |

## Verdict

PASS.
