import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("🛰️ Incoming request to /api/features/roadmap");

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Missing Google API key");
    return NextResponse.json({ error: "Missing Google API key" }, { status: 500 });
  }

  try {
    console.log("🌐 Sending request to Gemini API...");

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
Generate a clean, structured, and step-by-step *learning roadmap* for "${query}".
Format it in strict JSON only (no markdown, no extra text).

The structure must look like this:
{
  "topic": "name",
  "overview": "short summary of what the topic covers",
  "roadmap": [
    {
      "stage": "Step name",
      "description": "Explain what to learn in this step and why it matters",
      "estimated_time": "e.g. 2 weeks",
      "resources": [
        { "title": "Resource Name", "type": "video | course | article | book", "url": "https://..." }
      ]
    }
  ]
}

Make sure the output is realistic, motivating, and easy to follow for beginners.
`
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Raw Gemini response:", JSON.stringify(data, null, 2));

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.text ||
      "";

    // Clean up the response
    const text = rawText.trim();

    // Attempt to extract valid JSON from AI response
    let roadmapJSON;
    try {
      const match = text.match(/\{[\s\S]*\}/); // Extract first JSON object
      roadmapJSON = match ? JSON.parse(match[0]) : null;
    } catch (err: unknown) {
  console.error('Error fetching roadmap:', err); // optional: log the error
  roadmapJSON = null;
}

    // Fallback if parsing fails
    if (!roadmapJSON) {
      roadmapJSON = {
        topic: query,
        overview: "No structured data returned.",
        roadmap: [
          {
            stage: "AI Response",
            description: text || "Error parsing roadmap.",
            estimated_time: "N/A",
            resources: [],
          },
        ],
      };
    }

    return NextResponse.json(roadmapJSON, { status: 200 });
  }catch (err: unknown) {
  let message = "Unknown error";
  if (err instanceof Error) message = err.message;
  console.error(message);
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}
}
