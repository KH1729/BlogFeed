# Spec: new-post-dialog

## Goals

1. Users open creation UI via an explicit **New post** control (not an always-on card).
2. Creation UI appears in a modal overlay (focus trap, Escape to close when not submitting).
3. Preserve validation (react-hook-form + zod) and API behavior.

## Functional Requirements

### FR-1: Trigger

A **New post** button is visible in the page header area (primary/contained).

### FR-2: Modal

- Opens on button click.
- Contains fields: title, body; actions: Publish, Cancel.
- Shows API/validation errors inside the dialog when create fails.
- Closes on successful create; feed refreshes.

### FR-3: Guardrails

While `isSubmitting`, do not close via backdrop or Escape (avoid duplicate submits / lost state).

## Acceptance Criteria

- Component tests cover dialog open content and error alert.
- Existing `NewPostForm` validation test still passes.
