import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { App } from "./App.js";
import { createPost, fetchPosts } from "./lib/api.js";
import { renderWithTheme } from "./test/renderWithTheme.js";

vi.mock("./lib/api.js", () => ({
  fetchPosts: vi.fn(),
  createPost: vi.fn(),
}));

describe("App", () => {
  beforeEach(() => {
    vi.mocked(fetchPosts).mockResolvedValue([]);
    vi.mocked(createPost).mockResolvedValue({
      id: "1",
      title: "t",
      body: "b",
      createdAt: new Date().toISOString(),
    });
  });

  it("opens the new post dialog with an empty-feed intro when there are no posts", async () => {
    renderWithTheme(<App />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      /there are no posts in your feed yet/i,
    );
  });
});
