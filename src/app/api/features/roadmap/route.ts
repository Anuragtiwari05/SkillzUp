import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleAuth } from "google-auth-library";

export async function GET(req: Request) {
  console.log("🛰️ Incoming request to /api/features/roadmap");

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  console.log("🔍 Roadmap query received:", query);

  if (!query) {
    return NextResponse.json(
      { error: "Please provide a topic (?q=topic)" },
      { status: 400 }
    );
  }

  try {
    // Path to your service account JSON
    const keyFilePath = path.join(process.cwd(), "service-account.json");

    if (!fs.existsSync(keyFilePath)) {
      console.error("❌ Missing service-account.json for Gemini API!");
      return NextResponse.json({ error: "Service account not found" }, { status: 500 });
    }

    const auth = new GoogleAuth({
      keyFile: keyFilePath,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const url = "https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-flash:generateText";

    const payload = {
      prompt: `You are a SkillzUp roadmap agent. Generate a structured roadmap for learning "${query}". Return JSON with stages, topics, resources, and estimated time per stage.`,
      temperature: 0.7,
      maxOutputTokens: 800,
    };

    console.log("🌐 Sending request to Gemini API...");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Gemini API error:", text);
      return NextResponse.json({ error: text }, { status: response.status });
    }

    const data = await response.json();
    console.log("✅ Gemini API returned:", data);

    // Extract AI text response
    const outputText = data?.candidates?.[0]?.content?.[0]?.text || "{}";

    let roadmapJSON;
    try {
      roadmapJSON = JSON.parse(outputText);
    } catch (err) {
      console.error("⚠️ Failed to parse Gemini JSON:", err);
      return NextResponse.json({ error: "Failed to parse roadmap JSON" }, { status: 500 });
    }

    return NextResponse.json(roadmapJSON);
  } catch (error) {
    console.error("🔥 Error in /api/features/roadmap:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
