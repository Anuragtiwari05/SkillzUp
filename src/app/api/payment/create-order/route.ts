// src/app/api/payment/create-order/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import razorpay from "@/lib/razorpayClient";
import Payment from "@/models/payment";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    await dbConnect();

    // 1) Auth: read JWT token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }
    const userId = decoded.userId;

    // 2) Read request body
    const body = await req.json();
    // Accept either amountInRupees OR planId with price mapping
    const { amount, planId, currency = "INR", receipt } = body;

    // Basic validation
    let amountInRupees: number | undefined = undefined;

    if (typeof amount === "number" && amount > 0) {
      amountInRupees = amount;
    } else if (planId) {
      // If you want plan-based pricing here, map planId -> price (simple fallback)
      const planMap: Record<string, number> = {
        plan6: 50,
        plan12: 80,
        plan15: 100,
      };
      amountInRupees = planMap[planId];
    }

    if (!amountInRupees || amountInRupees <= 0) {
      return NextResponse.json({ success: false, error: "Invalid amount or planId" }, { status: 400 });
    }

    // 3) Create Razorpay order (amount in paise)
    const options = {
      amount: Math.round(amountInRupees * 100), // paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // 4) Save Payment record in DB with status "created"
    const paymentDoc = new Payment({
      userId,
      amount: amountInRupees,
      currency,
      orderId: order.id,
      status: "created",
      createdAt: new Date(),
    });

    await paymentDoc.save();

    // 5) Return order + payment id
    return NextResponse.json({
      success: true,
      order,
      paymentRecordId: paymentDoc._id,
    });
  } catch (err: any) {
    console.error("❌ create-order error:", err);
    return NextResponse.json({
      success: false,
      error: err.message || "Internal Server Error",
    }, { status: 500 });
  }
}
