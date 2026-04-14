import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import type { NewPostFormValues } from "./NewPostForm.js";
import { NewPostForm } from "./NewPostForm.js";

export interface NewPostDialogProps {
  /** @description Whether the dialog is visible. */
  open: boolean;
  /** @description Called when the dialog should close (backdrop click, Escape, Cancel). */
  onClose: () => void;
  /** @description Optional info shown above the form (e.g. empty-feed onboarding). */
  introMessage?: string | null;
  /** @description Server or validation error message for the create flow. */
  formError: string | null;
  /** @description Persists the new post. */
  onSubmit: (values: NewPostFormValues) => Promise<void>;
  /** @description True while the create request is in flight. */
  isSubmitting: boolean;
}

/**
 * @description Modal shell for creating a post (title + body).
 * @param props Open state, close handler, and form wiring.
 * @returns MUI Dialog containing {@link NewPostForm}.
 */
export function NewPostDialog({
  open,
  onClose,
  introMessage,
  formError,
  onSubmit,
  isSubmitting,
}: NewPostDialogProps) {
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
      aria-labelledby="new-post-dialog-title"
    >
      <DialogTitle id="new-post-dialog-title">New post</DialogTitle>
      <DialogContent>
        {introMessage ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            {introMessage}
          </Alert>
        ) : null}
        {formError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        ) : null}
        <NewPostForm
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
