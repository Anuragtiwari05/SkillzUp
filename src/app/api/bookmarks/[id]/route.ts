import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Bookmark from "@/models/Bookmark";
import { getUserId } from "@/lib/auth";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await dbConnect();
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
    }

    const deleted = await Bookmark.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Bookmark not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Delete bookmark error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
