import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import { getUserId } from "@/lib/auth";
import { recordFeatureViewActivity, bumpStreak } from "@/lib/activity";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = await getUserId();
    if (!userId) {
      // Anonymous browsing is fine — activity tracking is a logged-in-only feature.
      return NextResponse.json({ success: true, skipped: true });
    }

    const { type, url, title } = await req.json();
    if (!type || !url || !title) {
      return NextResponse.json({ success: false, error: "type, url and title are required" }, { status: 400 });
    }

    await Promise.all([recordFeatureViewActivity(userId, type, url, title), bumpStreak(userId)]);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Record view activity error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
