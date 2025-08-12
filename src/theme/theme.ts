import type { ThemeOptions } from "@mui/material/styles";

export function getDesignTokens(level: 0 | 1 | 2 | 3): ThemeOptions {
  const palette =
    level === 0
      ? { mode: "light" as const, primary: { main: "#1976d2" }, background: { default: "#f7f9fc", paper: "#ffffff" } }
      : level === 1
      ? { mode: "light" as const, primary: { main: "#1565c0" }, background: { default: "#eef2f8", paper: "#ffffff" } }
      : level === 2
      ? { mode: "dark" as const, primary: { main: "#90caf9" }, background: { default: "#0b0f19", paper: "#111827" } }
      : { mode: "dark" as const, primary: { main: "#81d4fa" }, background: { default: "#0a0a0a", paper: "#111111" } };

  return {
    palette, // palette shape per docs. :contentReference[oaicite:1]{index=1}
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: `"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
      h5: { fontWeight: 700 },
      subtitle1: { opacity: 0.85 },
    },
    components: {
      MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
      MuiAppBar: { styleOverrides: { root: { borderRadius: 16 } } },
    },
  };
}
