import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import UserRoadmap from "@/models/UserRoadmap";
import { getUserId } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
    }

    const roadmaps = await UserRoadmap.find({ userId })
      .sort({ createdAt: -1 })
      .select("topic skillLevel goal timeAvailability stages createdAt");

    return NextResponse.json({ success: true, roadmaps });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("List roadmaps error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
