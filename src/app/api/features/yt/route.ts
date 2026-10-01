import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("🛰️ Incoming request to /api/features/yt");

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  console.log("🔍 Search query received:", query);

  if (!query) {
    return NextResponse.json(
      { error: "Please provide a search query (?q=topic)" },
      { status: 400 }
    );
  }

  try {
    const YT_API_KEY = process.env.YT_API_KEY;
    if (!YT_API_KEY) {
      console.error("❌ Missing YT_API_KEY in .env!");
      return NextResponse.json({ error: "YT_API_KEY not set" }, { status: 500 });
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(
      query
    )}&key=${YT_API_KEY}`;

    console.log("🌐 Fetching:", url);

    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      console.error("❌ YouTube API error:", text);
      return NextResponse.json({ error: text }, { status: response.status });
    }

    const data = await response.json();
    console.log("✅ YouTube API returned", data.items?.length, "videos");

    // Best-effort: attach each video's duration (ISO 8601). Never fails the request.
    try {
      const ids = (data.items || [])
        .map((v: { id?: { videoId?: string } }) => v.id?.videoId)
        .filter(Boolean)
        .join(",");
      if (ids) {
        const detailsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${ids}&key=${YT_API_KEY}`
        );
        if (detailsRes.ok) {
          const details = await detailsRes.json();
          const durations = new Map<string, string>(
            (details.items || []).map((d: { id: string; contentDetails?: { duration?: string } }) => [
              d.id,
              d.contentDetails?.duration ?? "",
            ])
          );
          for (const v of data.items) v.duration = durations.get(v.id?.videoId) || undefined;
        }
      }
    } catch {}

    return NextResponse.json({ items: data.items });
  } catch (err: unknown) {
  let message = "Unknown error";
  if (err instanceof Error) message = err.message;
  console.error(message);
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}
}
