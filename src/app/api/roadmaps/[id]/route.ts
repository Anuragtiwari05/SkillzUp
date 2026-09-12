import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import UserRoadmap from "@/models/UserRoadmap";
import { getUserId } from "@/lib/auth";
import { recordRoadmapActivity } from "@/lib/activity";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
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

    await recordRoadmapActivity(userId, id, roadmap.topic);

    return NextResponse.json({ success: true, roadmap });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Get roadmap error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
