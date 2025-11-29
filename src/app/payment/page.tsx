"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");

  console.log("🔍 Plan from URL:", planId);

  const subscriptionPlans: Record<string, any> = {
    plan6: { duration: "6 Months", price: 5, color: "yellow" },
    plan12: { duration: "12 Months", price: 10, color: "green" },
    plan15: { duration: "15 Months", price: 15, color: "blue" },
  };

  const plan = planId ? subscriptionPlans[planId] : null;
  console.log("📌 Selected plan object:", plan);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const startPayment = async () => {
    if (!plan) return;

    console.log("🚀 Starting payment for plan:", planId);

    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, amount: plan.price * 100 }),
      });

      const data = await res.json();
      console.log("📦 Order API response:", data);

      if (!data.success || !data.order) {
        alert("Payment creation failed: " + data.error);
        return;
      }

      const order = data.order;
      const loaded: any = await loadRazorpay();
      if (!loaded) {
        alert("Failed to load Razorpay SDK");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "SkillzUp Premium",
        description: `${plan.duration} Subscription`,
        order_id: order.id,
        prefill: { name: "SkillzUp User", email: "user@example.com", contact: "9999999999" },
        theme: { color: "#2563eb" },
        handler: function (response: any) {
          console.log("✅ Payment completed:", response);
          // Redirect using window.location.href to avoid router issues
          window.location.href = `/payment/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&plan=${planId}`;
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      console.log("💳 Razorpay opened");
    } catch (error) {
      console.error("❌ Error in startPayment:", error);
      alert("Something went wrong while starting payment.");
    }
  };

  useEffect(() => {
    if (plan) {
      console.log("💡 Triggering payment for plan:", planId);
      startPayment();
    }
  }, [plan]);

  if (!plan)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Invalid plan selected.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-black mb-4">Processing Your Payment...</h1>
      <p className="text-gray-600 text-lg mb-6">
        You are purchasing the <span className="font-bold text-blue-600">{plan.duration}</span>{" "}
        subscription. Please wait.
      </p>
      <p className="text-gray-500 text-sm mt-2">Please wait while we redirect you to Razorpay...</p>
    </div>
  );
}
