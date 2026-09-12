"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PLANS, PlanId } from "@/lib/plans";

export default function PaymentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");

  const plan = planId ? PLANS[planId as PlanId] : null;

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
        body: JSON.stringify({ planId }),
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
        description: `${plan.name} Subscription`,
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
      <div className="min-h-screen flex items-center justify-center px-6 text-xl text-neutral-600 text-center bg-background">
        Invalid plan selected.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-20 text-center">
      <div className="w-12 h-12 rounded-full border-[3px] border-primary-200 border-t-primary-600 animate-spin mb-6" />

      <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-neutral-900 mb-4">
        Processing Your Payment...
      </h1>

      <p className="text-neutral-600 text-base sm:text-lg max-w-md leading-relaxed">
        You are purchasing the{" "}
        <span className="font-bold text-primary-700">{plan.name}</span>{" "}
        (₹{plan.price}) subscription.
        <br />
        Please do not refresh the page.
      </p>
    </div>
  );
}
