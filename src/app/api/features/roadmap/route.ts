import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import { getUserId } from "@/lib/auth";
import { generateAndSaveRoadmap } from "@/lib/roadmapGenerator";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to generate a roadmap." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { topic, skillLevel, goal, timeAvailability } = body as {
      topic?: string;
      skillLevel?: string;
      goal?: string;
      timeAvailability?: string;
    };

    if (!topic || !skillLevel || !goal) {
      return NextResponse.json(
        { success: false, error: "topic, skillLevel and goal are required" },
        { status: 400 }
      );
    }

    const result = await generateAndSaveRoadmap({ userId, topic, skillLevel, goal, timeAvailability });

    if (!result.success) {
      return NextResponse.json(result, { status: result.status });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Roadmap generation error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
