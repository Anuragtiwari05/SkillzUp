// Shared helpers the chat uses to fetch videos / articles / news (same providers as /api/features/*).

export type ResourceType = "video" | "article" | "news";

export interface ResourceItem {
  title: string;
  url: string;
  thumbnail: string;
  source: string;
  meta: string;
}

export interface ResourceGroup {
  type: ResourceType;
  items: ResourceItem[];
}

export interface ChatResources {
  topic: string;
  groups: ResourceGroup[];
}

export interface ResourceRequest {
  types: ResourceType[];
  topic: string; // may be "" when the user didn't name one ("no I want videos")
}

const VIDEO = /\b(vid\w*|videos?|vidoes|youtube|yt|tutorials?|channels?|watch)\b/i;
const ARTICLE = /\b(articles?|blogs?|guides?|docs|documentation|reads?|reading)\b/i;
const NEWS = /\b(news|headlines|trending)\b/i;
const ALL = /\b(everything|all resources|all of it|all things|resources)\b/i;

const FILLER = new Set(
  (
    "i me my we you your want wnt wanna need needs show give get find fetch send some any the a an of on about for to " +
    "please pls plz can could would should will is are am be also and or in with related regarding like no not yes " +
    "yeah yep nope okay ok hey hi hello latest top best good great new more another other recommend suggest " +
    "learn learning study video videos vidoes vids youtube yt tutorial tutorials channel channels watch article " +
    "articles blog blogs guide guides docs documentation read reading news headlines trending everything all " +
    "resources resource stuff things thing that this those these it from just only really want's dont don't"
  ).split(" ")
);

/** Detects "give me videos/articles/news (about X)" style requests without needing an LLM call. */
export function detectResourceRequest(message: string): ResourceRequest | null {
  const types: ResourceType[] = [];
  if (VIDEO.test(message)) types.push("video");
  if (ARTICLE.test(message)) types.push("article");
  if (NEWS.test(message)) types.push("news");
  if (ALL.test(message) && types.length === 0) types.push("video", "article", "news");
  if (types.length === 0) return null;

  const topic = message
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !FILLER.has(w))
    .join(" ")
    .trim()
    .slice(0, 80);

  return { types, topic };
}

const decode = (t: string) =>
  t.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

/* ------------------------------ fetchers ------------------------------ */

function isoDuration(iso?: string): string {
  const m = iso?.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return "";
  const h = Number(m[1] || 0);
  const mi = Number(m[2] || 0);
  const s = Number(m[3] || 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(mi)}:${pad(s)}` : `${mi}:${pad(s)}`;
}

function readTime(...texts: (string | undefined)[]): string {
  for (const t of texts) {
    const m = t?.match(/\[\+?(\d+) chars\]/);
    if (m) return `${Math.max(1, Math.round(Number(m[1]) / 5 / 220))} min read`;
  }
  return "";
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function fetchVideos(q: string): Promise<ResourceItem[]> {
  const key = process.env.YT_API_KEY;
  if (!key) return [];
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${encodeURIComponent(q)}&key=${key}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  const items: any[] = (data.items || []).filter((v: any) => v?.id?.videoId);

  const durations = new Map<string, string>();
  try {
    const ids = items.map((v) => v.id.videoId).join(",");
    if (ids) {
      const d = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${ids}&key=${key}`);
      if (d.ok) {
        for (const x of (await d.json()).items || []) durations.set(x.id, x.contentDetails?.duration || "");
      }
    }
  } catch {}

  return items.map((v) => ({
    title: decode(v.snippet?.title || "Untitled video"),
    url: `https://www.youtube.com/watch?v=${v.id.videoId}`,
    thumbnail: v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.medium?.url || "",
    source: v.snippet?.channelTitle || "YouTube",
    meta: isoDuration(durations.get(v.id.videoId)) || "Video",
  }));
}

async function fetchArticles(q: string): Promise<ResourceItem[]> {
  const key = process.env.ARTICLE_API_KEY;
  if (!key) return [];
  const res = await fetch(
    `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&max=6&apikey=${key}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.articles || []).map((a: any) => ({
    title: a.title || "No title",
    url: a.url || "#",
    thumbnail: a.image || "",
    source: a.source?.name || "Article",
    meta: readTime(a.content, a.description) || "Article",
  }));
}

async function fetchNews(q: string): Promise<ResourceItem[]> {
  const key = process.env.NEWS_API_KEY;
  if (!key) return [];
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&pageSize=6&apiKey=${key}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.articles || []).map((a: any) => ({
    title: a.title || "No title",
    url: a.url || "#",
    thumbnail: a.urlToImage || "",
    source: a.source?.name || "News",
    meta: readTime(a.content, a.description) || "News",
  }));
}

export async function fetchResources(types: ResourceType[], topic: string): Promise<ChatResources> {
  const run = (t: ResourceType) =>
    (t === "video" ? fetchVideos(topic) : t === "article" ? fetchArticles(topic) : fetchNews(topic)).catch(
      () => [] as ResourceItem[]
    );
  const groups = await Promise.all(types.map(async (type) => ({ type, items: await run(type) })));
  return { topic, groups: groups.filter((g) => g.items.length > 0) };
}
