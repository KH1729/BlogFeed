import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithTheme } from "../test/renderWithTheme.js";
import { NewPostDialog } from "./NewPostDialog.js";

describe("NewPostDialog", () => {
  it("renders the dialog and form when open", () => {
    renderWithTheme(
      <NewPostDialog
        open
        onClose={vi.fn()}
        formError={null}
        isSubmitting={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /new post/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^title$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^body$/i)).toBeInTheDocument();
  });

  it("shows an error alert when formError is set", () => {
    renderWithTheme(
      <NewPostDialog
        open
        onClose={vi.fn()}
        formError="Something failed"
        isSubmitting={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Something failed");
  });

  it("shows an info alert when introMessage is set", () => {
    renderWithTheme(
      <NewPostDialog
        open
        onClose={vi.fn()}
        introMessage="The feed is empty."
        formError={null}
        isSubmitting={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("The feed is empty.");
  });
});
