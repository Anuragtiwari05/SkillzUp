"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { checkAuthNow } from "@/hooks/useAuth";

export default function BookmarkButton({
  itemType,
  sourceUrl,
  title,
  thumbnailUrl,
  saved,
  onChange,
  className = "",
}: {
  itemType: "video" | "article" | "news";
  sourceUrl: string;
  title: string;
  thumbnailUrl?: string;
  saved: boolean;
  onChange: (saved: boolean) => void;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);

    try {
      const isLoggedIn = await checkAuthNow();
      if (!isLoggedIn) {
        router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      if (saved) {
        await fetch(`/api/bookmarks?sourceUrl=${encodeURIComponent(sourceUrl)}`, {
          method: "DELETE",
          credentials: "include",
        });
        onChange(false);
      } else {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ itemType, sourceUrl, title, thumbnailUrl }),
        });
        onChange(true);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      aria-label={saved ? "Remove bookmark" : "Save bookmark"}
      className={`p-2 rounded-full bg-white/90 backdrop-blur shadow-md hover:scale-110 transition-transform ${className}`}
    >
      {saved ? (
        <BookmarkCheck className="w-4 h-4 text-primary-600" />
      ) : (
        <Bookmark className="w-4 h-4 text-neutral-700" />
      )}
    </button>
  );
}
