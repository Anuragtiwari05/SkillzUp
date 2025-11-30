"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentClient() {
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

    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, amount: plan.price * 100 }),
      });

      const data = await res.json();
      if (!data.success || !data.order) return alert("Payment failed.");

      const order = data.order;

      const loaded: any = await loadRazorpay();
      if (!loaded) return alert("Failed to load Razorpay.");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "SkillzUp Premium",
        description: `${plan.duration} Subscription`,
        order_id: order.id,
        handler: function (response: any) {
          window.location.href = `/payment/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&plan=${planId}`;
        },
      };

      const payObj = new (window as any).Razorpay(options);
      payObj.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    if (plan) startPayment();
  }, [plan]);

  if (!plan)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Invalid plan selected.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-black mb-4">
        Processing Your Payment...
      </h1>
      <p className="text-gray-600 text-lg mb-6">
        You are purchasing the{" "}
        <span className="font-bold text-blue-600">{plan.duration}</span>{" "}
        subscription.
      </p>
    </div>
  );
}
