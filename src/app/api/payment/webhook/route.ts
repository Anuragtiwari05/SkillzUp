// src/app/api/payment/verify-webhook/route.ts
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

    const body = await req.text(); // RAW BODY required for signature check
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ success: false, error: "Missing signature" }, { status: 400 });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.log("❌ Invalid Webhook Signature");
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    const data = JSON.parse(body);

    // Razorpay payment events:
    // - payment.captured
    // - payment.failed
    // - order.paid
    const event = data.event;

    // Handle only successful payments
    if (event === "payment.captured") {
      const paymentEntity = data.payload.payment.entity;

      const { order_id, amount } = paymentEntity;

      // Find DB payment record
      const paymentRecord = await Payment.findOne({ orderId: order_id });

      if (!paymentRecord) {
        return NextResponse.json({ success: false, error: "Payment record not found" });
      }

      // Mark payment as PAID
      paymentRecord.status = "paid";
      paymentRecord.paidAt = new Date();
      await paymentRecord.save();

      // Activate subscription for user
      const userId = paymentRecord.userId;

      // Convert amount to correct plan validity
      let months = 0;
      if (amount / 100 === 50) months = 6;
      if (amount / 100 === 80) months = 12;
      if (amount / 100 === 100) months = 15;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);

      await Subscription.create({
        userId,
        amount: amount / 100,
        startDate,
        endDate,
        status: "active",
      });

      // Optionally update user model
      await User.findByIdAndUpdate(userId, { isSubscribed: true });

      console.log("🎉 Subscription activated:", userId);

      return NextResponse.json({ success: true });
    }

    // Payment failed
    if (event === "payment.failed") {
      console.log("❌ Payment failed");
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

// Disable Next.js body parsing for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};
