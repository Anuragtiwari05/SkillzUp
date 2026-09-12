import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import UserStreak from "@/models/UserStreak";
import { getUserId } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
    }

    const streak = await UserStreak.findOne({ userId });

    return NextResponse.json({
      success: true,
      streak: streak
        ? { currentStreak: streak.currentStreak, longestStreak: streak.longestStreak }
        : { currentStreak: 0, longestStreak: 0 },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Get streak error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
