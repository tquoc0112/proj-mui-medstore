import type { PaletteMode } from "@mui/material";

type Level = 0 | 1 | 2 | 3;
/** 0: light | 1: med-light | 2: med-dark | 3: dark */
const levelToMode = (level: Level): PaletteMode =>
  level >= 2 ? "dark" : "light";

export const getDesignTokens = (level: Level) => {
  const mode = levelToMode(level);
  const primaryMain =
    mode === "light"
      ? level === 1
        ? "#2962ff"
        : "#1a73e8"
      : level === 3
      ? "#90caf9"
      : "#64b5f6";

  return {
    palette: {
      mode,
      primary: { main: primaryMain },
      background: {
        default: mode === "light" ? "#f7f8fb" : "#0b1220",
        paper: mode === "light" ? "#ffffff" : "#0f172a",
      },
    },
    shape: { borderRadius: 16 },
    components: {
      MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { borderRadius: 0 } },
      },
    },
  };
};
