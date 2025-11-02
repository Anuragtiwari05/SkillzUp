import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import ChatSession from "@/models/chatsession";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// ⛳ Gemini or OpenAI (choose your model)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { message, sessionId } = await req.json();

    if (!message) {
      return NextResponse.json({ success: false, error: "Message required" });
    }

    // 🔐 Get user from cookie (token)
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;
    const activeSessionId = sessionId || uuidv4(); // create new if not provided

    // 🔎 Fetch or create session
    let session = await ChatSession.findOne({ sessionId: activeSessionId });
    if (!session) {
      session = new ChatSession({
        userId,
        sessionId: activeSessionId,
        messages: [],
      });
    }

    // 💬 Add user message
    session.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // 🤖 Call Gemini API (you can replace this with OpenAI if needed)
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
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

    const aiData = await aiResponse.json();
    const aiMessage =
      aiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I’m not sure how to respond.";

    // 💬 Add assistant reply
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
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
