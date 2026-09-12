import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import ChatSession from "@/models/chatsession";
import { getUserId } from "@/lib/auth";

// Note: [id] here is the session's `sessionId` field (a uuid), not the Mongo _id —
// that's the identifier already used everywhere else (POST /api/chat, the sidebar).

// ✅ DELETE /api/chat/[id]
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await dbConnect();
    const userId = await getUserId();

    const session = await ChatSession.findOne({ sessionId: id });
    if (!session)
      return NextResponse.json({ success: false, error: "Chat not found" }, { status: 404 });

    if (userId && session.userId !== userId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await ChatSession.deleteOne({ sessionId: id });

    return NextResponse.json({ success: true, message: "Chat deleted successfully" });
  }  catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } else {
    console.error(err);
    return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
  }
}
}

// ✅ GET /api/chat/[id]
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await dbConnect();
    const userId = await getUserId();

    const session = await ChatSession.findOne({ sessionId: id });

    if (!session)
      return NextResponse.json({ success: false, error: "Chat not found" }, { status: 404 });

    if (userId && session.userId !== userId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      title: session.title,
      messages: session.messages,
    });
  }  catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } else {
    console.error(err);
    return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
  }
}
}
