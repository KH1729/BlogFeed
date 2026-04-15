import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithTheme } from "../test/renderWithTheme.js";
import { EditPostDialog } from "./EditPostDialog.js";

const samplePost = {
  id: "p1",
  title: "Original title",
  body: "Original body",
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("EditPostDialog", () => {
  it("renders the dialog with Save and pre-filled fields", () => {
    renderWithTheme(
      <EditPostDialog
        open
        post={samplePost}
        onClose={vi.fn()}
        formError={null}
        isSubmitting={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /edit post/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^save$/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^title$/i)).toHaveValue("Original title");
    expect(screen.getByLabelText(/^body$/i)).toHaveValue("Original body");
  });

  it("shows an error alert when formError is set", () => {
    renderWithTheme(
      <EditPostDialog
        open
        post={samplePost}
        onClose={vi.fn()}
        formError="Update failed"
        isSubmitting={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Update failed");
  });
});
