export interface LearningIntent {
  intent: boolean;
  topic: string | null;
}

export interface ClassifyAndReplyResult extends LearningIntent {
  reply: string | null; // populated only when intent is false — saves a second API call
}

/**
 * One Gemini call that both (a) decides whether the message expresses intent
 * to learn a skill/topic — using the model itself, not keyword matching, so
 * phrasings like "I want to learn React JS", "teach me Python", "help me get
 * better at Docker" all work reliably — and (b), if it doesn't, generates the
 * normal conversational reply in the same call. This halves the API calls
 * needed for ordinary chat (previously: one call to classify + a second to
 * reply), which matters a lot on a rate-limited API key.
 */
export async function classifyAndMaybeReply(
  message: string,
  systemPrompt: string
): Promise<ClassifyAndReplyResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { intent: false, topic: null, reply: null };

  const prompt = `${systemPrompt}

A user just sent you this message: "${message.replace(/"/g, '\\"')}"

First, decide whether this message expresses a genuine intent to learn, study, or get better at a specific skill or topic (examples: "I want to learn React", "teach me Python", "help me get better at Docker", "how do I learn system design", "can you help me study for AWS certification"). General questions, greetings, or unrelated chat do NOT count as learning intent.

Respond with STRICT JSON only, no markdown fences, no extra text, in exactly this shape:
{"intent": true or false, "topic": "short topic name" or null, "reply": "your normal conversational reply, following the instructions above" or null}

If intent is true, set "reply" to null (it won't be used). If intent is false, "reply" must contain your full normal answer to the user's message.`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini classify-and-reply API error:", response.status, data?.error?.message);
      return { intent: false, topic: null, reply: null };
    }

    const rawText: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.text ||
      "";

    const match = rawText.trim().match(/\{[\s\S]*\}/);
    if (!match) return { intent: false, topic: null, reply: null };

    const parsed = JSON.parse(match[0]);
    const intent = Boolean(parsed.intent) && typeof parsed.topic === "string" && parsed.topic.trim().length > 0;

    return {
      intent,
      topic: typeof parsed.topic === "string" ? parsed.topic.trim() : null,
      reply: !intent && typeof parsed.reply === "string" ? parsed.reply : null,
    };
  } catch (err) {
    console.error("Classify-and-reply failed:", err);
    return { intent: false, topic: null, reply: null };
  }
}
