import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import ChatSession from "@/models/chatsession";
import { v4 as uuidv4 } from "uuid";
import { getUserId } from "@/lib/auth";
import { bumpStreak, recordChatActivity } from "@/lib/activity";
import { classifyAndMaybeReply } from "@/lib/chatIntent";
import { parseSkillLevel, parseGoal, parseTimeAvailability } from "@/lib/onboardingParser";
import { generateAndSaveRoadmap } from "@/lib/roadmapGenerator";

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
// GET — list the logged-in user's chat sessions (Chat History, Section 6)
// ---------------------------------------------
export async function GET() {
  try {
    await dbConnect();

    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
    }

    const sessions = await ChatSession.find({ userId }).sort({ updatedAt: -1 });

    return NextResponse.json(sessions);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("GET /api/chat error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

async function askGemini(userMessage: string): Promise<string> {
  const finalPrompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}`;

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
      }),
    }
  );

  const geminiData = await geminiRes.json();

  if (!geminiRes.ok) {
    console.error("Gemini API error:", geminiRes.status, geminiData?.error?.message);
    if (geminiRes.status === 429) {
      return "Our AI assistant is at capacity right now (rate limit) — please try again in a minute.";
    }
  }

  return (
    geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I'm having trouble thinking of a response right now — please try again in a moment."
  );
}

const SKILL_LEVEL_QUESTION = "What's your current skill level with this — **Beginner**, **Intermediate**, or **Advanced**?";
const GOAL_QUESTION = "Got it. What's your main goal — **get a job**, a **personal hobby**, or **pass an exam/certification**?";
const TIME_QUESTION = "Last one — how much time can you commit per week? **Less than 2 hours**, **2-5 hours**, or **5+ hours**?";

// ---------------------------------------------
// POST — Chat with Gemini; also runs the conversational roadmap-onboarding
// flow (skill level → goal → time, then generates a saved roadmap) when the
// message expresses intent to learn something.
// ---------------------------------------------
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { message, sessionId } = await req.json();

    if (!message)
      return NextResponse.json({ success: false, error: "Message required" }, { status: 400 });

    // Anonymous users can still chat; their sessions just won't show up in Chat History.
    const userId = (await getUserId()) || "anonymous";
    const isLoggedIn = userId !== "anonymous";

    // Create or use session
    const activeSessionId = sessionId || uuidv4();
    let session = await ChatSession.findOne({ sessionId: activeSessionId });
    if (!session)
      session = new ChatSession({ userId, sessionId: activeSessionId, messages: [] });

    session.messages.push({ role: "user", content: message, timestamp: new Date() });
    if (!session.title) {
      session.title = message.slice(0, 60);
    }

    let aiReply: string;

    try {
      if (session.roadmapOnboarding) {
        // --- Mid-onboarding: parse the answer for the current step ---
        const { step, topic, answers } = session.roadmapOnboarding;

        if (step === "skillLevel") {
          const parsed = parseSkillLevel(message);
          if (!parsed) {
            aiReply = `Sorry, I didn't quite catch that — ${SKILL_LEVEL_QUESTION}`;
          } else {
            session.roadmapOnboarding.answers.skillLevel = parsed;
            session.roadmapOnboarding.step = "goal";
            aiReply = GOAL_QUESTION;
          }
        } else if (step === "goal") {
          const parsed = parseGoal(message);
          if (!parsed) {
            aiReply = `Just want to make sure I get this right — ${GOAL_QUESTION}`;
          } else {
            session.roadmapOnboarding.answers.goal = parsed;
            session.roadmapOnboarding.step = "time";
            aiReply = TIME_QUESTION;
          }
        } else {
          const parsed = parseTimeAvailability(message);
          if (!parsed) {
            aiReply = `Sorry, could you clarify that — ${TIME_QUESTION}`;
          } else {
            answers.timeAvailability = parsed;
            const result = await generateAndSaveRoadmap({
              userId,
              topic,
              skillLevel: answers.skillLevel!,
              goal: answers.goal!,
              timeAvailability: parsed,
            });

            if (result.success) {
              session.title = `Learning ${result.topic} Roadmap`;
              aiReply = `🎉 Your personalized **${result.topic}** roadmap is ready! I've saved it to your dashboard — [view it here](/dashboard/${result.roadmapId}).`;
            } else {
              aiReply = `Sorry, I hit a snag generating that roadmap (${result.error}). Want to try again?`;
            }
            session.roadmapOnboarding = null;
          }
        }
      } else {
        // --- No active onboarding: one Gemini call both classifies intent
        // AND (if there's no learning intent) generates the normal reply —
        // half the API calls of doing these as two separate requests.
        const { intent, topic, reply } = await classifyAndMaybeReply(message, SYSTEM_PROMPT);

        if (intent && topic) {
          if (!isLoggedIn) {
            aiReply = `I'd love to build a **${topic}** roadmap for you! First, please [log in](/auth/login?redirect=%2Fchat) (or sign up if you're new) so I can save it to your account — then just ask again.`;
          } else {
            session.roadmapOnboarding = { topic, step: "skillLevel", answers: {} };
            aiReply = `Awesome, let's build you a **${topic}** roadmap. ${SKILL_LEVEL_QUESTION}`;
          }
        } else if (reply) {
          aiReply = reply;
        } else {
          // Combined call came back without a usable reply (e.g. rate limit) — fall back once.
          aiReply = await askGemini(message);
        }
      }
    } catch (flowErr: unknown) {
      console.error("Chat onboarding/generation error:", flowErr);
      aiReply = "Sorry, I hit an unexpected error there — mind trying that again in a moment?";
      session.roadmapOnboarding = null;
    }

    session.messages.push({ role: "assistant", content: aiReply, timestamp: new Date() });
    session.updatedAt = new Date();
    await session.save();

    if (isLoggedIn) {
      await Promise.all([
        recordChatActivity(userId, activeSessionId, session.title || message.slice(0, 60)),
        bumpStreak(userId),
      ]);
    }

    return NextResponse.json({
      success: true,
      reply: aiReply,
      sessionId: activeSessionId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("POST /api/chat error:", message);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try sending that again." },
      { status: 500 }
    );
  }
}
