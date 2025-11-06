import { NextResponse } from "next/server";
import crypto from "crypto";

// ✅ Razorpay sends POST requests to this endpoint
export async function POST(req: Request) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

    const body = await req.text(); // get raw body for signature verification
    const signature = req.headers.get("x-razorpay-signature");

    // 🔒 Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("❌ Invalid Razorpay webhook signature");
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // ✅ Handle different event types
    switch (event.event) {
      case "payment.captured":
        console.log("✅ Payment captured:", event.payload.payment.entity);
        break;

      case "subscription.charged":
        console.log("🔁 Subscription charged:", event.payload.subscription.entity);
        break;

      case "subscription.cancelled":
        console.log("❌ Subscription cancelled:", event.payload.subscription.entity);
        break;

      default:
        console.log("ℹ️ Unhandled webhook event:", event.event);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
