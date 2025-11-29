import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/utils/db";
import Payment from "@/models/payment";
import Subscription from "@/models/subsciption";
import User from "@/models/User";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.text(); 
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing signature" },
        { status: 400 }
      );
    }

    // 🔐 Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.log("❌ Invalid Webhook Signature");
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    const data = JSON.parse(body);
    const event = data.event;

    // 🎯 PAYMENT SUCCESS EVENT
    if (event === "payment.captured") {
      const paymentEntity = data.payload.payment.entity;
      const { order_id, amount } = paymentEntity; // Razorpay sends amount in paise

      // Find payment record
      const paymentRecord = await Payment.findOne({ orderId: order_id });

      if (!paymentRecord) {
        return NextResponse.json({
          success: false,
          error: "Payment record not found",
        });
      }

      // Update payment status
      paymentRecord.status = "paid";
      paymentRecord.paidAt = new Date();
      await paymentRecord.save();

      const userId = paymentRecord.userId;

      // 💥 FIXED PLAN MAPPING (correct prices)
      let months = 0;

      if (amount === 500) months = 6;      // ₹5 → 6 months
      if (amount === 1000) months = 12;    // ₹10 → 12 months
      if (amount === 1500) months = 15;    // ₹15 → 15 months

      if (months === 0) {
        console.log("❌ Invalid plan amount received:", amount);
        return NextResponse.json(
          { success: false, error: "Invalid amount" },
          { status: 400 }
        );
      }

      // Create subscription dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);

      // Save subscription
      await Subscription.create({
        userId,
        amount: amount / 100, // convert paise → INR
        startDate,
        endDate,
        status: "active",
      });

      // ⭐ Update user premium status
      await User.findByIdAndUpdate(userId, {
        isPremium: true,
        plan: `${months}-months`,
        expiresAt: endDate,
      });

      console.log("🎉 Premium Activated for:", userId);

      return NextResponse.json({ success: true });
    }

    // ❌ PAYMENT FAILED
    if (event === "payment.failed") {
      console.log("❌ Payment failed");
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
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

export const config = {
  api: {
    bodyParser: false,
  },
};
