import { NextResponse } from "next/server";
import razorpay from "@/lib/razorpayClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", receipt } = body;

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // convert to paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    console.log("🪙 Creating Razorpay order with:", options);

    const order = await razorpay.orders.create(options);

    console.log("✅ Razorpay order created:", order.id);

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("❌ Error creating Razorpay order:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
