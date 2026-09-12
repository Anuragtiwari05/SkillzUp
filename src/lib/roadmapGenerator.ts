import mongoose from "mongoose";
import UserRoadmap from "@/models/UserRoadmap";
import { bumpStreak, recordRoadmapActivity } from "@/lib/activity";

const SKILL_LEVEL_LABEL: Record<string, string> = {
  beginner: "a complete beginner",
  intermediate: "someone with intermediate experience",
  advanced: "an advanced learner looking to specialize",
};

const GOAL_LABEL: Record<string, string> = {
  job: "landing a job in this field",
  hobby: "learning this as a personal hobby, at a relaxed pace",
  exam: "passing a specific exam or certification",
};

const TIME_LABEL: Record<string, string> = {
  lt2: "less than 2 hours per week",
  "2to5": "2-5 hours per week",
  "5plus": "5+ hours per week",
};

export interface GenerateRoadmapInput {
  userId: string;
  topic: string;
  skillLevel: string;
  goal: string;
  timeAvailability?: string;
}

export interface GenerateRoadmapResult {
  success: true;
  roadmapId: string;
  topic: string;
  overview: string;
  stages: any[];
}

export interface GenerateRoadmapError {
  success: false;
  error: string;
  status: number;
}

export async function generateAndSaveRoadmap(
  input: GenerateRoadmapInput
): Promise<GenerateRoadmapResult | GenerateRoadmapError> {
  const { userId, topic, skillLevel, goal, timeAvailability } = input;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { success: false, error: "Missing Google API key", status: 500 };
  }

  const timeClause = timeAvailability
    ? ` They have about ${TIME_LABEL[timeAvailability] ?? timeAvailability} to dedicate to this.`
    : "";

  const prompt = `
Generate a clean, structured, step-by-step *learning roadmap* for "${topic}".
The learner is ${SKILL_LEVEL_LABEL[skillLevel] ?? skillLevel}, and their goal is ${GOAL_LABEL[goal] ?? goal}.${timeClause}
Tailor the number of stages, pacing, and depth of each stage to that skill level, goal, and time budget.

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

Make sure the output is realistic, motivating, and directly reflects the learner's stated skill level and goal.
`;

  let data: any;
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
        }),
      }
    );
    data = await response.json();

    if (!response.ok) {
      console.error("Gemini roadmap-generation API error:", response.status, data?.error?.message);
      const isQuota = response.status === 429;
      return {
        success: false,
        error: isQuota
          ? "The AI service is temporarily busy (rate limit reached). Please try again in a minute."
          : "The AI service returned an error. Please try again.",
        status: 502,
      };
    }
  } catch (err: unknown) {
    console.error("Gemini request failed:", err);
    return { success: false, error: "Could not reach the AI service. Please try again.", status: 502 };
  }

  const rawText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    data?.candidates?.[0]?.content?.text ||
    "";

  const text = rawText.trim();

  let roadmapJSON: any = null;
  try {
    const match = text.match(/\{[\s\S]*\}/);
    roadmapJSON = match ? JSON.parse(match[0]) : null;
  } catch (err: unknown) {
    console.error("Error parsing roadmap JSON:", err);
    roadmapJSON = null;
  }

  if (!roadmapJSON || !Array.isArray(roadmapJSON.roadmap)) {
    return { success: false, error: "Could not generate a structured roadmap. Please try again.", status: 502 };
  }

  const stages = roadmapJSON.roadmap.map((stage: any) => ({
    title: stage.stage || "Untitled stage",
    description: stage.description || "",
    estimatedTime: stage.estimated_time || "",
    resources: Array.isArray(stage.resources) ? stage.resources : [],
    completed: false,
  }));

  const saved = await UserRoadmap.create({
    userId,
    topic: roadmapJSON.topic || topic,
    skillLevel,
    goal,
    timeAvailability,
    stages,
  });

  const savedId = (saved._id as mongoose.Types.ObjectId).toString();

  await Promise.all([recordRoadmapActivity(userId, savedId, saved.topic), bumpStreak(userId)]);

  return {
    success: true,
    roadmapId: savedId,
    topic: saved.topic,
    overview: roadmapJSON.overview || "",
    stages: saved.stages,
  };
}
