// src/app/api/payment/create-order/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import razorpay from "@/lib/razorpayClient";
import Payment from "@/models/payment";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { PLANS, PlanId } from "@/lib/plans";

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

    // ---------- OPTIONAL AUTH (does NOT block payment) ----------
    let userId: string = "anonymous";
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;

      console.log("🔍 Token received (optional):", token ? "YES" : "NO");

      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string };
        if (decoded && typeof decoded === "object" && "userId" in decoded && decoded.userId) {
          userId = decoded.userId;
        }
        console.log("✅ Token decoded, using userId:", userId);
      } else {
        console.log("ℹ️ No token present, proceeding as anonymous user");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Non-fatal auth error in create-order:", err.message);
      } else {
        console.error("Non-fatal auth error in create-order:", err);
      }
      console.log("➡️ Proceeding with anonymous user for payment");
    }

    // ---------- BODY ----------
    const body = await req.json();
    console.log("📦 Request Body:", body);

    const { amount, planId, currency = "INR", receipt } = body;

    let amountInRupees: number | undefined = undefined;

    // Prefer planId mapping when provided (prevents mismatched client amounts)
    const plan = planId ? PLANS[planId as PlanId] : undefined;
    if (plan) {
      amountInRupees = plan.price;
      console.log("💰 Amount (from plan):", amountInRupees, "Plan:", planId);
    } else if (typeof amount === "number" && amount > 0) {
      // Some clients send paise; accept both formats safely.
      // Heuristic: for INR, values >= 1000 are almost certainly paise.
      const normalized =
        currency === "INR" && amount >= 1000 ? amount / 100 : amount;
      amountInRupees = normalized;
      console.log("💰 Amount (normalized):", amountInRupees, "Raw:", amount, "Currency:", currency);
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

  }catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } else {
    console.error(err);
    return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
  }
}
}
