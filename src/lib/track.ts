"use client";

export function recordView(type: "video" | "article" | "news", url: string, title: string) {
  fetch("/api/activity/view", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ type, url, title }),
  }).catch(() => {});
}
