"use client";

import { useEffect, useState } from "react";
import { Youtube, FileText, TrendingUp, Trash2, Bookmark as BookmarkIcon } from "lucide-react";
import AppShell from "@/component/AppShell";
import Card from "@/component/ui/Card";
import Reveal from "@/component/ui/Reveal";
import Loader from "@/component/ui/Loader";

type BookmarkItem = {
  _id: string;
  itemType: "video" | "article" | "news";
  sourceUrl: string;
  title: string;
  thumbnailUrl?: string;
  savedAt: string;
};

const GROUPS: { type: BookmarkItem["itemType"]; label: string; icon: typeof Youtube }[] = [
  { type: "video", label: "Videos", icon: Youtube },
  { type: "article", label: "Articles", icon: FileText },
  { type: "news", label: "News", icon: TrendingUp },
];

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[] | null>(null);

  useEffect(() => {
    fetch("/api/bookmarks", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBookmarks(data.bookmarks);
      });
  }, []);

  const remove = async (id: string) => {
    setBookmarks((prev) => (prev ? prev.filter((b) => b._id !== id) : prev));
    await fetch(`/api/bookmarks/${id}`, { method: "DELETE", credentials: "include" });
  };

  return (
    <AppShell active="bookmarks" title="Bookmarks">
      {bookmarks === null && <Loader size="lg" label="Loading your bookmarks..." />}

      {bookmarks !== null && bookmarks.length === 0 && (
        <Reveal>
          <Card hover={false} className="p-10 text-center">
            <BookmarkIcon className="w-10 h-10 text-primary-500 mx-auto mb-4" />
            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-2">No bookmarks yet</h2>
            <p className="text-neutral-600">
              Save videos, articles, and news from the feature pages to see them here.
            </p>
          </Card>
        </Reveal>
      )}

      {bookmarks !== null &&
        bookmarks.length > 0 &&
        GROUPS.map((group) => {
          const items = bookmarks.filter((b) => b.itemType === group.type);
          if (items.length === 0) return null;

          return (
            <div key={group.type} className="mb-10">
              <h2 className="flex items-center gap-2 font-heading font-bold text-lg text-neutral-900 mb-4">
                <group.icon className="w-5 h-5 text-primary-600" /> {group.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, idx) => (
                  <Reveal key={item._id} delay={Math.min(idx * 0.05, 0.3)}>
                    <Card hover={false} className="p-4 flex gap-3">
                      {item.thumbnailUrl && (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-sm text-neutral-900 line-clamp-2 hover:text-primary-700"
                        >
                          {item.title}
                        </a>
                      </div>
                      <button
                        onClick={() => remove(item._id)}
                        aria-label="Remove bookmark"
                        className="flex-shrink-0 text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
    </AppShell>
  );
}
