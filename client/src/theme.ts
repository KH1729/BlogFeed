import { createTheme, type Theme } from "@mui/material/styles";

/**
 * @description Application MUI theme (dark palette aligned with prior blog UI).
 * @returns Configured MUI theme.
 */
export function createAppTheme(): Theme {
  return createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#0f172a",
        paper: "#1e293b",
      },
    },
  });
}
