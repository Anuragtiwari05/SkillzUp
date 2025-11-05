import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import ChatSession from "@/models/chatsession";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const JWT_SECRET = process.env.JWT_SECRET!;

// ✅ GET - Fetch all sessions for the logged-in user
export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const sessions = await ChatSession.find({ userId: decoded.userId }).sort({ updatedAt: -1 });

    return NextResponse.json(sessions);
  } catch (err) {
    console.error("❌ GET /api/chat error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ POST - Send message to Gemini and save conversation
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

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const activeSessionId = sessionId || uuidv4();

    // Find or create chat session
    let session = await ChatSession.findOne({ sessionId: activeSessionId });
    if (!session)
      session = new ChatSession({ userId, sessionId: activeSessionId, messages: [] });

    session.messages.push({ role: "user", content: message, timestamp: new Date() });

    // ✅ Send request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // ✅ Extract AI response safely
    const aiMessage =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.output ||
      "Sorry, I’m not sure how to respond.";

    // Save assistant message
    session.messages.push({ role: "assistant", content: aiMessage, timestamp: new Date() });
    await session.save();

    return NextResponse.json({
      success: true,
      reply: aiMessage,
      sessionId: activeSessionId,
    });
  } catch (err: any) {
    console.error("❌ POST /api/chat error:", err.message);
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
