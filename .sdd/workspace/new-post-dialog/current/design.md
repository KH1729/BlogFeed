# Design: new-post-dialog

## Components

| Piece | Responsibility |
|-------|------------------|
| `App` | Owns `isNewPostOpen`, wires `createPost` + `loadPosts`, passes errors into dialog |
| `NewPostDialog` | MUI `Dialog` + `DialogTitle` + `DialogContent`; embeds `NewPostForm` |
| `NewPostForm` | Stateless form fields + Cancel when `onCancel` provided; no outer `Card` |

## Behavior

- `Dialog.onClose`: ignore backdrop/Escape while submitting; otherwise clear error state and close.
- Successful submit: parent closes dialog after `loadPosts()`.

## Location

[`client/src`](../../../../client/src).
