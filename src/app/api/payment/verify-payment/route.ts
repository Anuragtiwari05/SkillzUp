import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import connectDB from "@/utils/db"; // <-- CHANGE THIS IF WRONG
import User from "@/models/User";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // verify signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // GET USER FROM COOKIES
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not logged in" },
        { status: 401 }
      );
    }

    // UPDATE USER PREMIUM STATUS
    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      premiumPlan: planId ?? "default",
      premiumActivatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified & user premium activated",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
