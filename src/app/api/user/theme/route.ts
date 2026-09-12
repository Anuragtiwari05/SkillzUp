import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import User from "@/models/User";
import { getUserId } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
    }

    const { themePreference } = await req.json();
    if (!["light", "dark", "system"].includes(themePreference)) {
      return NextResponse.json({ success: false, error: "Invalid theme preference" }, { status: 400 });
    }

    await User.findByIdAndUpdate(userId, { themePreference });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Update theme error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
