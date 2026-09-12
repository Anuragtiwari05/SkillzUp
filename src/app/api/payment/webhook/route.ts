import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/utils/db";
import Payment from "@/models/payment";
import Subscription from "@/models/subsciption";
import User from "@/models/User";
import { getPlanByAmount } from "@/lib/plans";

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
      const isAnonymous = !userId || userId === "anonymous";

      // 💥 PLAN MAPPING driven by the shared plans config (src/lib/plans.ts)
      const matchedPlan = getPlanByAmount(amount / 100); // amount is in paise
      const months = matchedPlan?.months ?? 0;

      if (months === 0) {
        console.log("❌ Invalid plan amount received:", amount);
        return NextResponse.json(
          { success: false, error: "Invalid amount" },
          { status: 400 }
        );
      }

      // For anonymous payments, we only record the payment; no user/subscription updates
      if (!isAnonymous) {
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
      } else {
        console.log("ℹ️ Anonymous payment captured; skipping user premium/subscription update");
      }

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
