import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithTheme } from "../test/renderWithTheme.js";
import { NewPostForm } from "./NewPostForm.js";

describe("NewPostForm", () => {
  it("shows validation messages when submitted empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithTheme(<NewPostForm onSubmit={onSubmit} isSubmitting={false} />);

    await user.click(screen.getByRole("button", { name: /publish/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
