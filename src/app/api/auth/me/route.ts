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
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      username: string;
      email: string;
    };

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
  } catch (error: any) {
    console.error("Auth check error:", error.message);
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }
}
