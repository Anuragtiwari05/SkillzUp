"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Preference = "light" | "dark" | "system";

interface ThemeContextValue {
  preference: Preference;
  resolvedTheme: "light" | "dark";
  setPreference: (pref: Preference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolve(pref: Preference): "light" | "dark" {
  if (pref === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return pref;
}

function apply(theme: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<Preference>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = (localStorage.getItem("themePreference") as Preference | null) ?? "system";
    setPreferenceState(stored);
    const resolved = resolve(stored);
    setResolvedTheme(resolved);
    apply(resolved);

    // Best-effort: pull a logged-in user's saved preference if nothing local yet
    if (!localStorage.getItem("themePreference")) {
      fetch("/api/user/me", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user?.themePreference) {
            setPreferenceState(data.user.themePreference);
            const r = resolve(data.user.themePreference);
            setResolvedTheme(r);
            apply(r);
          }
        })
        .catch(() => {});
    }
  }, []);

  const setPreference = useCallback((pref: Preference) => {
    setPreferenceState(pref);
    localStorage.setItem("themePreference", pref);
    const resolved = resolve(pref);
    setResolvedTheme(resolved);
    apply(resolved);

    fetch("/api/user/theme", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ themePreference: pref }),
    }).catch(() => {});
  }, []);

  return (
    <ThemeContext.Provider value={{ preference, resolvedTheme, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
