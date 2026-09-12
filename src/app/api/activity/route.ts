import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import UserActivity from "@/models/UserActivity";
import { getUserId } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
    }

    const activity = await UserActivity.findOne({ userId });

    return NextResponse.json({ success: true, activity: activity || null });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Get activity error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
