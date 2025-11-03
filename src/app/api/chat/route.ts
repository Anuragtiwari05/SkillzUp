import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import ChatSession from "@/models/chatsession";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const JWT_SECRET = process.env.JWT_SECRET!;

/* ✅ GET → Fetch all chat sessions for a logged-in user */
export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;
    const sessions = await ChatSession.find({ userId }).sort({ updatedAt: -1 });
    return NextResponse.json(sessions);
  } catch {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

/* ✅ POST → Create / Continue chat with AI */
export async function POST(req: Request) {
  try {
    await dbConnect();

    const { message, sessionId } = await req.json();
    if (!message)
      return NextResponse.json({ success: false, error: "Message required" }, { status: 400 });

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;
    const activeSessionId = sessionId || uuidv4();

    // 🔍 Find or create chat session
    let session = await ChatSession.findOne({ sessionId: activeSessionId });
    if (!session) {
      session = new ChatSession({ userId, sessionId: activeSessionId, messages: [] });
    }

    // 💬 Add user message
    session.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // 🤖 Call Gemini API (Updated to latest model)
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: message }] }],
        }),
      }
    );

    const aiData = await aiResponse.json();
    const aiMessage =
      aiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I’m not sure how to respond.";

    // 💬 Add AI message
    session.messages.push({
      role: "assistant",
      content: aiMessage,
      timestamp: new Date(),
    });

    await session.save();

    return NextResponse.json({
      success: true,
      reply: aiMessage,
      sessionId: activeSessionId,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
