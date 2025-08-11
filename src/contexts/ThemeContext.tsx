import {
  createContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import { getDesignTokens } from "../theme/theme"; // <- make sure this file exists (below)

type Level = 0 | 1 | 2 | 3;

interface ThemeContextType {
  level: Level;
  setLevel: (l: Level) => void;
  cycle: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  level: 0,
  setLevel: () => {},
  cycle: () => {},
});

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/" || location.pathname === "/register";

  const [level, setLevel] = useState<Level>(() => {
    const s = localStorage.getItem("theme-level");
    return (s ? Number(s) : 0) as Level;
  });

  useEffect(() => {
    localStorage.setItem("theme-level", String(level));
  }, [level]);

  const theme = useMemo(() => createTheme(getDesignTokens(level)), [level]);
  const cycle = () => setLevel(((level + 1) % 4) as Level);

  if (isAuthPage) {
    // Do NOT theme the login/register screens
    return (
      <ThemeContext.Provider value={{ level, setLevel, cycle }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ level, setLevel, cycle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
