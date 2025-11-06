import { NextResponse } from "next/server";
import razorpay from "@/lib/razorpayClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan_id, customer_notify = 1 } = body;

    // ✅ Create a subscription using Razorpay SDK
    const subscription = await razorpay.subscriptions.create({
      plan_id,
      total_count: 12, // number of billing cycles (e.g., 12 months)
      customer_notify,
      notify_info: {
        notify_email: "user@example.com", // optional: can come from user session
      },
    });

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      data: subscription,
    });
  } catch (error: any) {
    console.error("❌ Error creating subscription:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create subscription", error },
      { status: 500 }
    );
  }
}
