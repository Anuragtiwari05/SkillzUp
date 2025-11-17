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

    const body = await req.text(); // RAW BODY is required for Razorpay signature verification
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing signature" },
        { status: 400 }
      );
    }

    // Verify signature
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

    // Handle successful payment capture
    if (event === "payment.captured") {
      const paymentEntity = data.payload.payment.entity;
      const { order_id, amount } = paymentEntity;

      // Find DB payment record
      const paymentRecord = await Payment.findOne({ orderId: order_id });

      if (!paymentRecord) {
        return NextResponse.json({
          success: false,
          error: "Payment record not found",
        });
      }

      // Mark payment as paid
      paymentRecord.status = "paid";
      paymentRecord.paidAt = new Date();
      await paymentRecord.save();

      const userId = paymentRecord.userId;

      // Determine subscription validity from amount
      let months = 0;
      if (amount / 100 === 50) months = 6;
      if (amount / 100 === 80) months = 12;
      if (amount / 100 === 100) months = 15;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);

      // Store subscription in DB
      await Subscription.create({
        userId,
        amount: amount / 100,
        startDate,
        endDate,
        status: "active",
      });

      // 🔥 Update USER Premium fields
      await User.findByIdAndUpdate(userId, {
        isPremium: true,
        plan: `${months}-months`,
        expiresAt: endDate,
      });

      console.log("🎉 Premium Activated for:", userId);

      return NextResponse.json({ success: true });
    }

    // Handle failed payments
    if (event === "payment.failed") {
      console.log("❌ Payment failed");
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}

// Disable body parsing for Razorpay webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};
