"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeMode = "light" | "dark";
export type ThemeAccent = "zinc" | "emerald" | "cyan" | "violet";

interface ThemeContextType {
  theme: ThemeMode;
  accent: ThemeAccent;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: ThemeAccent) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [accent, setAccentState] = useState<ThemeAccent>("zinc");

  // Hidrata el estado desde localStorage/preferencias del sistema tras el montaje
  // (evita mismatch de hidratación con el render inicial del servidor).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = localStorage.getItem("ph_theme") as ThemeMode | null;
    const savedAccent = localStorage.getItem("ph_accent") as ThemeAccent | null;

    if (savedTheme) {
      setThemeState(savedTheme);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark");
    }

    if (savedAccent) {
      setAccentState(savedAccent);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    root.setAttribute("data-accent", accent);

    try {
      localStorage.setItem("ph_theme", theme);
      localStorage.setItem("ph_accent", accent);
    } catch {}
  }, [theme, accent]);

  function setTheme(t: ThemeMode) {
    setThemeState(t);
  }

  function setAccent(a: ThemeAccent) {
    setAccentState(a);
  }

  function toggleTheme() {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ theme, accent, setTheme, setAccent, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "light" as ThemeMode,
      accent: "zinc" as ThemeAccent,
      setTheme: () => {},
      setAccent: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}
