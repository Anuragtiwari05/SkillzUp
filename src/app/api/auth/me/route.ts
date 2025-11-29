import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/utils/db";
import User from "@/models/User";

const jwtSecret = process.env.JWT_SECRET as string;

export async function GET(req: Request) {
  try {
    await dbConnect();

    // ✅ Extract token from cookies
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    // ✅ Verify token
    let decoded: unknown = null;

try {
  decoded = jwt.verify(token, jwtSecret);
} catch (err: unknown) {
  if (err instanceof Error) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } else {
    return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
  }
}

// Type narrowing
if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
  const userId = (decoded as { userId: string }).userId;
  console.log("👤 User ID:", userId);
} else {
  return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
}

    // ✅ Find user in DB
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 404 });
    }

    // ✅ Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
    console.error("Auth check error:", error.message);
  } else {
    console.error("Auth check error:", error);
  }
  return NextResponse.json({ success: false, user: null }, { status: 401 });
  }
}
