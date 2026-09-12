import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Bookmark from "@/models/Bookmark";
import { getUserId } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
    }

    const bookmarks = await Bookmark.find({ userId }).sort({ savedAt: -1 });
    return NextResponse.json({ success: true, bookmarks });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("List bookmarks error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
    }

    const { itemType, sourceUrl, title, thumbnailUrl } = await req.json();

    if (!itemType || !sourceUrl || !title) {
      return NextResponse.json(
        { success: false, error: "itemType, sourceUrl and title are required" },
        { status: 400 }
      );
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      { userId, sourceUrl },
      { $setOnInsert: { userId, itemType, sourceUrl, title, thumbnailUrl, savedAt: new Date() } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, bookmark });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Create bookmark error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Toggle-off from a result card, which only knows the sourceUrl (not the Mongo _id)
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sourceUrl = searchParams.get("sourceUrl");
    if (!sourceUrl) {
      return NextResponse.json({ success: false, error: "sourceUrl is required" }, { status: 400 });
    }

    await Bookmark.findOneAndDelete({ userId, sourceUrl });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Delete bookmark by url error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
