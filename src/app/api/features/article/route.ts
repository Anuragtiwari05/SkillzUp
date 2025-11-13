import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("🛰️ Incoming request to /api/features/articles");

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  console.log("🔍 Article query received:", query);

  if (!query) {
    return NextResponse.json(
      { error: "Please provide a topic (?q=topic)" },
      { status: 400 }
    );
  }

  try {
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    if (!NEWS_API_KEY) {
      console.error("❌ Missing NEWS_API_KEY in .env!");
      return NextResponse.json({ error: "NEWS_API_KEY not set" }, { status: 500 });
    }

    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
      query
    )}&lang=en&max=12&apikey=${NEWS_API_KEY}`;

    console.log("🌐 Fetching:", url);

    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      console.error("❌ News API error:", text);
      return NextResponse.json({ error: text }, { status: response.status });
    }

    const data = await response.json();
    console.log("✅ News API returned", data.articles?.length, "articles");

    return NextResponse.json({ items: data.articles });
  } catch (error) {
    console.error("🔥 Error in /api/features/articles:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
