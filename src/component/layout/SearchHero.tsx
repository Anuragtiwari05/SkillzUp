"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History, Search, X } from "lucide-react";

/* ---------- recent searches, stored per user (falls back to "guest") ---------- */
export function useRecentSearches(scope: string) {
  const [uid, setUid] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => !cancelled && setUid(d?.success && d.user?.id ? String(d.user.id) : "guest"))
      .catch(() => !cancelled && setUid("guest"));
    return () => {
      cancelled = true;
    };
  }, []);

  const key = uid ? `skillzup:recent:${scope}:${uid}` : null;

  useEffect(() => {
    if (!key) return;
    try {
      const raw = JSON.parse(localStorage.getItem(key) || "[]");
      setRecent(Array.isArray(raw) ? raw.slice(0, 6) : []);
    } catch {
      setRecent([]);
    }
  }, [key]);

  const persist = (list: string[]) => {
    setRecent(list);
    if (!key) return;
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}
  };

  return {
    recent,
    add: (q: string) => persist([q, ...recent.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 6)),
    clear: () => persist([]),
  };
}

export function Chip({
  children,
  onClick,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10"
    >
      {icon}
      {children}
    </button>
  );
}

/** Large search bar with an animated focus state, suggested-topic chips and recent searches. */
export default function SearchHero({
  query,
  setQuery,
  onSearch,
  placeholder,
  loading,
  suggestions,
  recent,
  onClearRecent,
  icon,
}: {
  query: string;
  setQuery: (q: string) => void;
  onSearch: (q: string) => void;
  placeholder: string;
  loading: boolean;
  suggestions: string[];
  recent: string[];
  onClearRecent: () => void;
  icon: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="max-w-3xl mx-auto">
      <motion.form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(query);
        }}
        animate={{ scale: focused ? 1.015 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={`relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-3xl border-2 bg-surface p-2 sm:pl-5 transition-[border-color,box-shadow] duration-300 ${
          focused ? "border-primary shadow-[var(--shadow-glow)]" : "border-border shadow-[var(--shadow-card)]"
        }`}
      >
        <motion.span
          animate={{ rotate: focused ? 8 : 0, scale: focused ? 1.15 : 1 }}
          className="hidden sm:flex text-link"
          aria-hidden
        >
          {icon}
        </motion.span>
        <label htmlFor="feature-search" className="sr-only">
          Search
        </label>
        <input
          id="feature-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete="off"
          className="flex-1 min-w-0 bg-transparent px-3 py-3 sm:py-4 text-base sm:text-xl font-medium text-foreground placeholder:text-muted-foreground outline-none"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 sm:py-4 font-bold text-primary-foreground transition-all hover:bg-primary/85 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search className="w-5 h-5" /> {loading ? "Searching…" : "Search"}
        </button>
      </motion.form>

      <div className="mt-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Try a topic</p>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <Chip key={s} onClick={() => onSearch(s)}>
              {s}
            </Chip>
          ))}
        </div>
      </div>

      {recent.length > 0 && (
        <div className="mt-6 text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent searches</p>
            <button
              type="button"
              onClick={onClearRecent}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-danger"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {recent.map((r) => (
              <Chip key={r} onClick={() => onSearch(r)} icon={<History className="w-3.5 h-3.5 text-muted-foreground" />}>
                {r}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
