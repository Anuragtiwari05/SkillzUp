"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Clock, ExternalLink, Newspaper, PlayCircle, RefreshCw, Youtube } from "lucide-react";
import Card from "@/component/ui/Card";
import BookmarkButton from "@/component/ui/BookmarkButton";
import SearchHero, { useRecentSearches } from "@/component/layout/SearchHero";
import { recordView } from "@/lib/track";

export type FeatureKind = "yt" | "article" | "news";

type Item = {
  id: string;
  title: string;
  source: string;
  url: string;
  thumbnail: string;
  meta: string;
  description: string;
};

const CONFIG: Record<
  FeatureKind,
  {
    endpoint: string;
    itemType: "video" | "article" | "news";
    placeholder: string;
    suggestions: string[];
    emptyTitle: string;
    emptyText: string;
    loadingLabel: string;
  }
> = {
  yt: {
    endpoint: "/api/features/yt",
    itemType: "video",
    placeholder: "Search YouTube tutorials…",
    suggestions: ["React", "Python", "System Design", "AI"],
    emptyTitle: "Find your next great tutorial",
    emptyText: "Search any topic, or tap a suggestion, and we will line up the best videos.",
    loadingLabel: "Fetching top YouTube videos",
  },
  article: {
    endpoint: "/api/features/article",
    itemType: "article",
    placeholder: "Search expert articles…",
    suggestions: ["React", "Python", "System Design", "AI"],
    emptyTitle: "Dig into a good read",
    emptyText: "Search any topic, or tap a suggestion, to pull in guides and in-depth articles.",
    loadingLabel: "Gathering articles",
  },
  news: {
    endpoint: "/api/features/news",
    itemType: "news",
    placeholder: "Search the latest tech news…",
    suggestions: ["React", "Python", "System Design", "AI"],
    emptyTitle: "Catch up on what is new",
    emptyText: "Search any topic, or tap a suggestion, to see the freshest industry headlines.",
    loadingLabel: "Fetching the latest news",
  },
};

/* ------------------------- normalisers ------------------------- */

function isoDuration(iso?: string): string {
  const m = iso?.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return "";
  const h = Number(m[1] || 0);
  const mi = Number(m[2] || 0);
  const s = Number(m[3] || 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(mi)}:${pad(s)}` : `${mi}:${pad(s)}`;
}

/** GNews / NewsAPI append "[1234 chars]" to truncated content: use it to estimate reading time. */
function readTime(...texts: (string | undefined)[]): string {
  for (const t of texts) {
    const m = t?.match(/\[\+?(\d+) chars\]/);
    if (m) return `${Math.max(1, Math.round(Number(m[1]) / 5 / 220))} min read`;
  }
  return "";
}

function timeAgo(iso?: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return "";
  const d = Math.floor(diff / 86400000);
  if (d < 1) return "Today";
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalise(kind: FeatureKind, raw: any[]): Item[] {
  if (kind === "yt") {
    return raw
      .filter((v) => v?.id?.videoId)
      .map((v) => ({
        id: v.id.videoId,
        title: v.snippet?.title || "Untitled video",
        source: v.snippet?.channelTitle || "YouTube",
        url: `https://www.youtube.com/watch?v=${v.id.videoId}`,
        thumbnail: v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.medium?.url || "",
        meta: isoDuration(v.duration) || "Video",
        description: v.snippet?.description || "",
      }));
  }
  return raw.map((a, i) => ({
    id: a.id || a.url || String(i),
    title: a.title || "No title",
    source: (typeof a.source === "string" ? a.source : a.source?.name) || "Unknown source",
    url: a.url || "#",
    thumbnail: a.image || a.urlToImage || "",
    meta: readTime(a.content, a.description) || timeAgo(a.publishedAt) || "Article",
    description: a.description || "",
  }));
}

/* ------------------------- pieces ------------------------- */

function EmptyIllustration() {
  return (
    <svg viewBox="0 0 240 160" className="w-56 sm:w-72 h-auto" aria-hidden>
      <ellipse cx="120" cy="140" rx="86" ry="10" fill="var(--border)" opacity="0.7" />
      <rect x="58" y="34" width="124" height="86" rx="14" fill="var(--surface)" stroke="var(--border)" strokeWidth="2" />
      <rect x="70" y="46" width="100" height="40" rx="8" fill="var(--primary)" opacity="0.25" />
      <path d="m111 56 20 10-20 10z" fill="var(--link)" />
      <rect x="70" y="95" width="70" height="7" rx="3.5" fill="var(--muted-foreground)" opacity="0.5" />
      <rect x="70" y="107" width="44" height="7" rx="3.5" fill="var(--muted-foreground)" opacity="0.3" />
      <circle cx="176" cy="34" r="22" fill="var(--accent)" />
      <circle cx="172" cy="30" r="9" fill="none" stroke="var(--accent-foreground)" strokeWidth="3" />
      <path d="m179 37 8 8" stroke="var(--accent-foreground)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="44" cy="58" r="5" fill="var(--link)" opacity="0.7" />
      <circle cx="198" cy="104" r="4" fill="var(--accent)" opacity="0.7" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface overflow-hidden" aria-hidden>
      <div className="h-48 bg-surface-elevated animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-11/12 rounded bg-surface-elevated animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-surface-elevated animate-pulse" />
        <div className="h-3 w-1/3 rounded bg-surface-elevated animate-pulse mt-4" />
      </div>
    </div>
  );
}

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function FeatureSearch({ kind }: { kind: FeatureKind }) {
  const cfg = CONFIG[kind];
  const { recent, add, clear } = useRecentSearches(kind);

  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [savedUrls, setSavedUrls] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/bookmarks", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSavedUrls(new Set(data.bookmarks.map((b: { sourceUrl: string }) => b.sourceUrl)));
      })
      .catch(() => {});
  }, []);

  const search = useCallback(
    async (raw: string) => {
      const q = raw.trim();
      if (!q) return;
      setQuery(q);
      setLastQuery(q);
      setStatus("loading");
      setErrorMsg("");
      setItems([]);
      try {
        const res = await fetch(`${cfg.endpoint}?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        const arr = Array.isArray(data.items) ? data.items : [];
        setItems(normalise(kind, arr));
        setStatus("done");
        add(q);
      } catch {
        setErrorMsg("We could not load results right now. Check your connection and try again.");
        setStatus("error");
      }
    },
    [cfg.endpoint, kind, add]
  );

  const toggleSaved = (url: string, saved: boolean) =>
    setSavedUrls((prev) => {
      const next = new Set(prev);
      if (saved) next.add(url);
      else next.delete(url);
      return next;
    });

  return (
    <>
      <SearchHero
        query={query}
        setQuery={setQuery}
        onSearch={search}
        placeholder={cfg.placeholder}
        loading={status === "loading"}
        suggestions={cfg.suggestions}
        recent={recent}
        onClearRecent={clear}
        icon={kind === "yt" ? <Youtube className="w-6 h-6" /> : <Newspaper className="w-6 h-6" />}
      />

      <div className="mt-14 min-h-[320px]" aria-live="polite">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center py-10"
            >
              <EmptyIllustration />
              <h2 className="mt-6 text-2xl sm:text-3xl font-heading font-bold text-foreground">{cfg.emptyTitle}</h2>
              <p className="mt-2 max-w-md text-muted-foreground">{cfg.emptyText}</p>
            </motion.div>
          )}

          {status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="status"
              aria-label={cfg.loadingLabel}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="mx-auto max-w-md rounded-3xl border border-danger/40 bg-danger/10 p-8 text-center"
            >
              <AlertTriangle className="mx-auto mb-3 w-9 h-9 text-danger" />
              <h2 className="text-xl font-heading font-bold text-foreground mb-1">Something went wrong</h2>
              <p className="text-sm text-muted-foreground mb-5">{errorMsg}</p>
              <button
                onClick={() => search(lastQuery)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-bold text-primary-foreground hover:bg-primary/85 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Try again
              </button>
            </motion.div>
          )}

          {status === "done" && items.length === 0 && (
            <motion.div
              key="none"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center py-10"
            >
              <EmptyIllustration />
              <h2 className="mt-6 text-2xl font-heading font-bold text-foreground">No results for &ldquo;{lastQuery}&rdquo;</h2>
              <p className="mt-2 text-muted-foreground">Try a broader topic or one of the suggestions above.</p>
            </motion.div>
          )}

          {status === "done" && items.length > 0 && (
            <motion.div key={`results-${lastQuery}`} initial="hidden" animate="show" variants={list}>
              <p className="mb-6 text-sm text-muted-foreground">
                {items.length} results for <span className="font-semibold text-foreground">&ldquo;{lastQuery}&rdquo;</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <motion.div key={item.id} variants={rise} className="h-full">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                      onClick={() => recordView(cfg.itemType, item.url, item.title)}
                    >
                      <Card className="group h-full overflow-hidden flex flex-col">
                        <div className="relative w-full h-48 bg-surface-elevated overflow-hidden">
                          {item.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.thumbnail}
                              alt=""
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                              {kind === "yt" ? <Youtube className="w-10 h-10" /> : <Newspaper className="w-10 h-10" />}
                            </div>
                          )}
                          {kind === "yt" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-scrim opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <PlayCircle className="w-14 h-14 text-foreground" />
                            </div>
                          )}
                          <BookmarkButton
                            className="absolute top-2 right-2"
                            itemType={cfg.itemType}
                            sourceUrl={item.url}
                            title={item.title}
                            thumbnailUrl={item.thumbnail || undefined}
                            saved={savedUrls.has(item.url)}
                            onChange={(saved) => toggleSaved(item.url, saved)}
                          />
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="font-heading font-bold text-lg text-foreground line-clamp-2 mb-2">{item.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>
                          <div className="mt-auto flex items-center justify-between gap-3 text-sm">
                            <span className="truncate font-semibold text-link">{item.source}</span>
                            <span className="inline-flex shrink-0 items-center gap-1 text-muted-foreground">
                              {kind === "yt" ? <Clock className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                              {item.meta}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
