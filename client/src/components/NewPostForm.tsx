import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(500),
  body: z.string().trim().min(1, "Body is required").max(50_000),
});

export type NewPostFormValues = z.infer<typeof formSchema>;

export interface NewPostFormProps {
  /** @description Called with validated values on submit. */
  onSubmit: (values: NewPostFormValues) => Promise<void>;
  /** @description When true, the submit control is disabled. */
  isSubmitting: boolean;
  /** @description When set, shows a Cancel control (e.g. dialog dismiss). */
  onCancel?: () => void;
  /** @description When true, shows an inline heading (omit when the shell provides a title). */
  showHeading?: boolean;
  /** @description Pre-filled fields (edit); omit for create. */
  defaultValues?: NewPostFormValues;
  /** @description Primary submit label (default Publish). */
  submitLabel?: string;
  /** @description Submit label while submitting (default Publishing…). */
  submittingLabel?: string;
  /** @description When true, reset the form after a successful submit (default true). */
  resetAfterSuccessfulSubmit?: boolean;
  /** @description Prefix for field element ids (default new-post). */
  fieldIdPrefix?: string;
}

const EMPTY_VALUES: NewPostFormValues = { title: "", body: "" };

/**
 * @description Form fields for creating or editing a post (title + body).
 * @param props Submit handler, loading state, and optional cancel/heading.
 * @returns Form markup.
 */
export function NewPostForm({
  onSubmit,
  isSubmitting,
  onCancel,
  showHeading = false,
  defaultValues,
  submitLabel = "Publish",
  submittingLabel = "Publishing…",
  resetAfterSuccessfulSubmit = true,
  fieldIdPrefix = "new-post",
}: NewPostFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewPostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? EMPTY_VALUES,
  });

  useEffect(() => {
    reset(defaultValues ?? EMPTY_VALUES);
  }, [defaultValues?.title, defaultValues?.body, reset]);

  const titleId = `${fieldIdPrefix}-title`;
  const bodyId = `${fieldIdPrefix}-body`;

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
        if (resetAfterSuccessfulSubmit) {
          reset();
        }
      })}
    >
      {showHeading ? (
        <Typography component="h2" variant="h6" gutterBottom>
          New post
        </Typography>
      ) : null}
      <Stack spacing={2} sx={{ mt: showHeading ? 2 : 0 }}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id={titleId}
              label="Title"
              autoComplete="off"
              fullWidth
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
            />
          )}
        />
        <Controller
          name="body"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id={bodyId}
              label="Body"
              multiline
              minRows={5}
              fullWidth
              error={Boolean(errors.body)}
              helperText={errors.body?.message}
            />
          )}
        />
      </Stack>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
        {onCancel ? (
          <Button type="button" variant="outlined" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </Box>
    </Box>
  );
}
