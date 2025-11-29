
import razorpay from "./razorpayClient";
import crypto from "crypto";

export async function createOrder(amount: number, currency = "INR") {
  const options = {
    amount: amount * 100, // amount in paise
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);
  return order;
}

export async function createSubscription(planId: string, customerNotify = 1) {
  const options = {
    plan_id: planId,
    total_count: 12, // e.g. 12 months
    customerNotify,
  };

  const subscription = await razorpay.subscriptions.create(options);
  return subscription;
}

export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const body = orderId + "|" + paymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === signature;
}
