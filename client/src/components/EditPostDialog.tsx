import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import type { NewPostFormValues } from "./NewPostForm.js";
import { NewPostForm } from "./NewPostForm.js";

import type { Post } from "../types/post.js";

export interface EditPostDialogProps {
  /** @description Whether the dialog is visible. */
  open: boolean;
  /** @description Called when the dialog should close (backdrop click, Escape, Cancel). */
  onClose: () => void;
  /** @description Post being edited. */
  post: Post;
  /** @description Server or validation error message for the update flow. */
  formError: string | null;
  /** @description Persists the updated post. */
  onSubmit: (values: NewPostFormValues) => Promise<void>;
  /** @description True while the update request is in flight. */
  isSubmitting: boolean;
}

/**
 * @description Modal shell for editing a post (title + body).
 * @param props Open state, post, close handler, and form wiring.
 * @returns MUI Dialog containing {@link NewPostForm}.
 */
export function EditPostDialog({
  open,
  onClose,
  post,
  formError,
  onSubmit,
  isSubmitting,
}: EditPostDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (isSubmitting && (reason === "backdropClick" || reason === "escapeKeyDown")) {
          return;
        }
        onClose();
      }}
      fullWidth
      maxWidth="sm"
      aria-labelledby="edit-post-dialog-title"
    >
      <DialogTitle id="edit-post-dialog-title">Edit post</DialogTitle>
      <DialogContent>
        {formError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        ) : null}
        <NewPostForm
          key={post.id}
          defaultValues={{ title: post.title, body: post.body }}
          fieldIdPrefix="edit-post"
          isSubmitting={isSubmitting}
          resetAfterSuccessfulSubmit={false}
          submitLabel="Save"
          submittingLabel="Saving…"
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
