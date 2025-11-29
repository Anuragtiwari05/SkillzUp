import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow all (safe locally)
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  console.log("✅ [API] /api/search POST triggered");

  try {
    const body = await req.json();
    const { topic } = body;

    if (!topic) {
      return NextResponse.json(
        { success: false, message: "Topic is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const n8nWebhookUrl =
      process.env.N8N_WEBHOOK_URL ||
      "http://127.0.0.1:2005/webhook/skillzup-search";

    console.log("🌐 Sending to n8n:", n8nWebhookUrl);

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    if (!n8nResponse.ok) {
      const errText = await n8nResponse.text();
      console.error("❌ n8n responded with error:", errText);
      return NextResponse.json(
        { success: false, message: "n8n error", details: errText },
        { status: 500, headers: corsHeaders }
      );
    }

    const data = await n8nResponse.json();
    console.log("✅ Got data from n8n:", data);

    return NextResponse.json(data, { status: 200, headers: corsHeaders });
  }  catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } else {
    console.error(err);
    return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
  }
}
}
