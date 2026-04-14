import { ThemeProvider } from "@mui/material/styles";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

import { createAppTheme } from "../theme.js";

const theme = createAppTheme();

function AllProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

/**
 * @description Renders UI wrapped in MUI ThemeProvider (required for components under test).
 * @param ui React tree to render.
 * @param options Optional RTL render options.
 * @returns RTL render result.
 */
export function renderWithTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}
