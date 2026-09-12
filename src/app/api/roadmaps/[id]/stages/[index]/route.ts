import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import UserRoadmap from "@/models/UserRoadmap";
import { getUserId } from "@/lib/auth";
import { bumpStreak } from "@/lib/activity";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string; index: string }> }
) {
  const { id, index } = await context.params;
  const stageIndex = Number(index);

  try {
    await dbConnect();
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
    }

    const roadmap = await UserRoadmap.findOne({ _id: id, userId });
    if (!roadmap) {
      return NextResponse.json({ success: false, error: "Roadmap not found" }, { status: 404 });
    }

    if (Number.isNaN(stageIndex) || !roadmap.stages[stageIndex]) {
      return NextResponse.json({ success: false, error: "Invalid stage index" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const nextValue =
      typeof body.completed === "boolean"
        ? body.completed
        : !roadmap.stages[stageIndex].completed;

    roadmap.stages[stageIndex].completed = nextValue;
    await roadmap.save();

    if (nextValue) {
      await bumpStreak(userId);
    }

    return NextResponse.json({
      success: true,
      stages: roadmap.stages,
      completionPercent: roadmap.completionPercent,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Toggle stage error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
