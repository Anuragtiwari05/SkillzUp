import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import ChatSession from "@/models/chatsession";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

// ✅ DELETE /api/chat/[id]
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // ✅ FIX: Await params
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const deleted = await ChatSession.findOneAndDelete({ _id: id, userId });
    if (!deleted)
      return NextResponse.json({ success: false, error: "Chat not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Chat deleted successfully" });
  } catch (err: any) {
    console.error("❌ DELETE /api/chat/[id] error:", err.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ GET /api/chat/[id] → fetch messages of a chat
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // ✅ FIX: Await params
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const session = await ChatSession.findOne({ sessionId: id, userId });
    if (!session)
      return NextResponse.json({ success: false, error: "Chat not found" }, { status: 404 });

    return NextResponse.json({ success: true, messages: session.messages });
  } catch (err: any) {
    console.error("❌ GET /api/chat/[id] error:", err.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
