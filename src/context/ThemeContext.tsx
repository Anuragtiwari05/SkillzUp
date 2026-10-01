"use client";

import { useCallback, useEffect, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

type Preference = "light" | "dark" | "system";
const STORAGE_KEY = "themePreference";

/** Pull a logged-in user's saved preference when nothing is stored on this device yet. */
function AccountThemeSync() {
  const { setTheme } = useNextTheme();

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }
    fetch("/api/user/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const pref = data?.user?.themePreference;
        if (data?.success && ["light", "dark", "system"].includes(pref)) setTheme(pref);
      })
      .catch(() => {});
  }, [setTheme]);

  return null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey={STORAGE_KEY}
    >
      <AccountThemeSync />
      {children}
    </NextThemesProvider>
  );
}

/** Same shape the Settings page already uses, now backed by next-themes. */
export function useTheme() {
  const { theme, resolvedTheme, setTheme } = useNextTheme();

  const setPreference = useCallback(
    (pref: Preference) => {
      setTheme(pref);
      fetch("/api/user/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ themePreference: pref }),
      }).catch(() => {});
    },
    [setTheme]
  );

  return {
    preference: (theme as Preference | undefined) ?? "system",
    resolvedTheme: (resolvedTheme as "light" | "dark" | undefined) ?? "light",
    setPreference,
  };
}
