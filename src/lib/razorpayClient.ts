// src/lib/razorpayClient.ts

/**This file creates and exports a single Razorpay client instance configured with your secret keys.
That client lets your backend securely talk to Razorpay — to:

🧾 create payment orders

🔁 create subscriptions

🪙 verify payments and refunds

All these actions must happen server-side (never in the browser), because they require your secret key */

import Razorpay from "razorpay";

/**
 * Server-side Razorpay client helper.
 * Reads keys from environment variables:
 *   - RAZORPAY_KEY_ID
 *   - RAZORPAY_KEY_SECRET
 *
 * Usage (server-side only):
 *   import razorpay from "@/lib/razorpayClient";
 *   const order = await razorpay.orders.create({...});
 */

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!KEY_ID || !KEY_SECRET) {
  // Fail fast on dev if env is missing — helps catch config issues early.
  throw new Error(
    "Razorpay keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment."
  );
}

const razorpay = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET,
});

export default razorpay;
