import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("🛰️ Incoming request to /api/features/article");

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
    const ARTICLE_API_KEY = process.env.ARTICLE_API_KEY;
    if (!ARTICLE_API_KEY) {
      console.error("❌ Missing ARTICLE_API_KEY in .env!");
      return NextResponse.json({ error: "ARTICLE_API_KEY not set" }, { status: 500 });
    }

    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
      query
    )}&lang=en&max=12&apikey=${ARTICLE_API_KEY}`;

    console.log("🌐 Fetching:", url);

    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Article API error:", text);
      return NextResponse.json({ error: text }, { status: response.status });
    }

    const data = await response.json();
    console.log("✅ Article API returned", data.articles?.length, "articles");

    return NextResponse.json({ items: data.articles });
  } catch (error) {
    console.error("🔥 Error in /api/features/article:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
