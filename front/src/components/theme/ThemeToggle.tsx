"use client";

import { useState } from "react";
import { useTheme, type ThemeAccent } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, accent, toggleTheme, setAccent } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const accents: { id: ThemeAccent; label: string; color: string }[] = [
    { id: "zinc", label: "Zinc Monocromo", color: "bg-zinc-900 dark:bg-zinc-100" },
    { id: "emerald", label: "Emerald Esmeralda", color: "bg-emerald-500" },
    { id: "cyan", label: "Cyan Neón", color: "bg-cyan-500" },
    { id: "violet", label: "Violeta Eléctrico", color: "bg-violet-500" },
  ];

  return (
    <div className="relative">
      <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 p-1 shadow-xs backdrop-blur-xs">
        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          title={theme === "light" ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro"}
        >
          {theme === "light" ? (
            /* Moon icon */
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          ) : (
            /* Sun icon */
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m8.966-8.966h-2.25m-13.5 0h-2.25m15.364-6.364l-1.591 1.591M6.758 17.242l-1.591 1.591m12.728 0l-1.591-1.591M6.758 6.758L5.167 5.167M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
            </svg>
          )}
        </button>

        {/* Accent Color Picker Trigger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          title="Personalizar Tema de Color"
        >
          <span className="h-3.5 w-3.5 rounded-full border border-slate-300 dark:border-zinc-700" style={{ backgroundColor: "var(--accent-color)" }}></span>
          <span className="capitalize hidden sm:inline">{accent}</span>
        </button>
      </div>

      {/* Customizer Dropdown Popover */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-xl z-50 animate-pop-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2 mb-2">
            <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">
              Color de Acento
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1">
            {accents.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setAccent(item.id);
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  accent === item.id
                    ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-bold"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${item.color}`}></span>
                  <span>{item.label}</span>
                </div>
                {accent === item.id && <span className="text-[10px] text-emerald-600 dark:text-emerald-400">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
