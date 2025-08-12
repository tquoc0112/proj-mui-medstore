import {
  createContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import { getDesignTokens } from "../theme/theme"; // keep your existing path

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
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/" || pathname === "/login" || pathname === "/register";

  const [level, setLevel] = useState<Level>(() => {
    const s = localStorage.getItem("theme-level");
    return (s ? Number(s) : 0) as Level;
  });

  useEffect(() => {
    localStorage.setItem("theme-level", String(level));
  }, [level]);

  const theme = useMemo(() => createTheme(getDesignTokens(level)), [level]);
  const cycle = () => setLevel(((level + 1) % 4) as Level);

  // Do NOT wrap Auth pages in ThemeProvider (your requirement)
  if (isAuthPage) {
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
