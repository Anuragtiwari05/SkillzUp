import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import ChatSession from "@/models/chatsession";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

// ✅ DELETE /api/chat/[id]
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  console.log("🗑️ DELETE request received for chat id:", id);

  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    console.log("🔐 Token found:", !!token);

    if (!token)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    console.log("👤 User ID decoded:", userId);

    const deleted = await ChatSession.findOneAndDelete({ _id: id, userId });
    console.log("🗂️ Deleted chat result:", deleted ? "Found & deleted" : "Not found");

    if (!deleted)
      return NextResponse.json({ success: false, error: "Chat not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Chat deleted successfully" });
  } catch (err: any) {
    console.error("❌ DELETE /api/chat/[id] error:", err.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ GET /api/chat/[id]
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  console.log("💬 GET request for chat id:", id);

  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    console.log("🔐 Token present:", !!token);

    if (!token)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    console.log("👤 Decoded user ID:", userId);

    // 🕵️‍♂️ Try finding chat by _id first
    const session = await ChatSession.findOne({ _id: id, userId });
    console.log("📄 Query result:", session ? "Session found" : "Session NOT found");

    if (!session)
      return NextResponse.json({ success: false, error: "Chat not found" }, { status: 404 });

    console.log("💬 Returning messages count:", session.messages?.length);
    return NextResponse.json({ success: true, messages: session.messages });
  } catch (err: any) {
    console.error("❌ GET /api/chat/[id] error:", err.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
