// src/app/api/payment/create-order/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import razorpay from "@/lib/razorpayClient";
import Payment from "@/models/payment";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  console.log("\n======================");
  console.log("📌 CREATE ORDER API HIT");
  console.log("======================");

  try {
    // DB connect
    console.log("🔗 Connecting to DB...");
    await dbConnect();
    console.log("✅ DB Connected");

    // ---------- AUTH ----------
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    console.log("🔍 Token received:", token ? "YES" : "NO");

    if (!token) {
      console.log("❌ No token → Unauthorized");
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log("✅ Token decoded:", decoded);
    } catch (e) {
      console.log("❌ JWT Decode Error:", e);
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;
    console.log("👤 User ID:", userId);

    // ---------- BODY ----------
    const body = await req.json();
    console.log("📦 Request Body:", body);

    const { amount, planId, currency = "INR", receipt } = body;

    let amountInRupees: number | undefined = undefined;

    if (typeof amount === "number" && amount > 0) {
      amountInRupees = amount;
      console.log("💰 Amount (given directly):", amountInRupees);
    } else if (planId) {
      const planMap: Record<string, number> = {
        plan6: 5,
        plan12: 10,
        plan15: 15,
      };
      amountInRupees = planMap[planId];
      console.log("💰 Amount (from plan):", amountInRupees, "Plan:", planId);
    }

    if (!amountInRupees || amountInRupees <= 0) {
      console.log("❌ Invalid amount or planId");
      return NextResponse.json({
        success: false,
        error: "Invalid amount or planId",
      }, { status: 400 });
    }

    // ---------- Razorpay Order ----------
    const options = {
      amount: Math.round(amountInRupees * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    console.log("📤 Creating Razorpay Order with options:", options);

    const order = await razorpay.orders.create(options);

    console.log("✅ Razorpay Order Created:", order.id);

    // ---------- Save Payment ----------
    const paymentDoc = new Payment({
      userId,
      amount: amountInRupees,
      currency,
      orderId: order.id,
      status: "created",
      createdAt: new Date(),
    });

    await paymentDoc.save();
    console.log("💾 Payment Saved in DB:", paymentDoc._id);

    // ---------- RETURN ----------
    return NextResponse.json({
      success: true,
      order,
      paymentRecordId: paymentDoc._id,
    });

  } catch (err: any) {
    console.error("❌ ERROR in create-order:", err);
    return NextResponse.json({
      success: false,
      error: err.message || "Internal Server Error",
    }, { status: 500 });
  }
}
