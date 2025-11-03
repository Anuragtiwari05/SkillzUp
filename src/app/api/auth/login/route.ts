import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/utils/db";
import User from "@/models/User";

const jwtSecret = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    console.log("🔐 Login attempt received...");
    await dbConnect();

    const { username, password } = await req.json();
    console.log("📥 Login payload:", { username, hasPassword: !!password });

    // ✅ Validate input
    if (!username || !password) {
      console.warn("⚠️ Missing username or password");
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    // ✅ Find user
    const user = await User.findOne({ username });
    if (!user) {
      console.warn("❌ User not found:", username);
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.warn("❌ Incorrect password for user:", username);
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    console.log("🎟️ Token generated for user:", username);

    // ✅ Build response
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
        },
      },
      { status: 200 }
    );

    // ✅ Set cookie properly
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict",
      path: "/", // accessible globally across routes
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    console.log("🍪 Token cookie set successfully for user:", username);
    return response;
  } catch (error) {
    console.error("💥 Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
