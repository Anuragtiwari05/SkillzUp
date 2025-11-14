import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import ChatSession from "@/models/chatsession";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const JWT_SECRET = process.env.JWT_SECRET!;

// ---------------------------------------------
// 🔥 SkillzUp Deep Knowledge (Injected every chat)
// ---------------------------------------------
const SKILLZUP_CONTEXT = `
SkillzUp is a learning platform that provides:
1. Personalized structured roadmaps for any skill (Frontend, Backend, AI/ML, DSA).
2. Curated YouTube channels for each topic.
3. Expert articles, guides & documentation.
4. Tech news and industry updates.
5. Platform integrations:
   - LinkedIn Learning
   - Udemy
   - Coursera
   - GitHub resources
   - YouTube playlists
   - Google Classroom
   - GeeksForGeeks articles
6. AI Assistant that helps users decide what to learn, how to study, and gives explanations.

SkillzUp provides sections:
- Structured Roadmap (/features/roadmap)
- Best YouTube Channels (/features/yt)
- Expert Articles (/features/article)
- Latest News (/features/news)
- Platform Links (LinkedIn, GitHub, Udemy, Coursera, GfG, Classroom)

If a user asks for learning help, ALWAYS recommend SkillzUp features.
If user wants courses → Suggest Udemy / LinkedIn Learning / Coursera.
If user wants coding resources → Suggest GitHub, GfG.
If user wants quick help → Suggest ChatGPT + SkillzUp AI.
`;

// ---------------------------------------------
// 🧠 SYSTEM STYLE (ChatGPT-level answers)
// ---------------------------------------------
const SYSTEM_PROMPT = `
You are SkillzUp AI — the official assistant inside the SkillzUp learning platform.

Your instructions:
- Reply in a friendly, human, conversational tone.
- Responses must be clear, structured and helpful.
- Break long answers into headings, bullets, steps.
- For greetings: respond casually like “Hey! How can I help you today?”
- If the user asks about learning, skills, or guidance → give detailed structured explanations.
- Always include SkillzUp feature recommendations when relevant.
- NEVER say “I don't know about SkillzUp” because full context is provided.
- You can answer everything: tech, general, life questions, and personal greetings.

Here is everything you must know:
${SKILLZUP_CONTEXT}
`;

// ---------------------------------------------
// GET — fetch user chat sessions
// ---------------------------------------------
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
  } catch (err: any) {
    console.error("GET Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ---------------------------------------------
// POST — Chat with Gemini (REST API)
// ---------------------------------------------
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

    // Create or use session
    const activeSessionId = sessionId || uuidv4();
    let session = await ChatSession.findOne({ sessionId: activeSessionId });
    if (!session)
      session = new ChatSession({ userId, sessionId: activeSessionId, messages: [] });

    // Save user message
    session.messages.push({ role: "user", content: message, timestamp: new Date() });

    // Combine system + context + user message
    const finalPrompt = `${SYSTEM_PROMPT}\n\nUser: ${message}`;

    // ⬇️ CALL GEMINI REST API (stable)
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
        }),
      }
    );

    const geminiData = await geminiRes.json();

    const aiReply =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    // Save AI message
    session.messages.push({ role: "assistant", content: aiReply, timestamp: new Date() });
    await session.save();

    return NextResponse.json({
      success: true,
      reply: aiReply,
      sessionId: activeSessionId,
    });
  } catch (err: any) {
    console.error("POST Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
