"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");

  const [loading, setLoading] = useState(false);

  // Your plan details (must match subscription.tsx)
  const subscriptionPlans: any = {
    plan6: { duration: "6 Months", price: 50, color: "yellow" },
    plan12: { duration: "12 Months", price: 80, color: "green" },
    plan15: { duration: "15 Months", price: 100, color: "blue" },
  };

  const plan = planId ? subscriptionPlans[planId] : null;

  // 🔵 Razorpay script loader
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

    setLoading(true);

    // Create order → backend
    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      body: JSON.stringify({ planId }),
    });

    const data = await res.json();
    if (!data.success) {
      alert("Payment error: " + data.error);
      setLoading(false);
      return;
    }

    const order = data.order;

    // Load razorpay SDK
    const loaded: any = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay failed to load. Check your internet.");
      setLoading(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // public key
      amount: order.amount,
      currency: order.currency,
      name: "SkillzUp Premium",
      description: `${plan.duration} Subscription`,
      order_id: order.id,

      handler: function () {
        router.push("/payment/success");
      },

      theme: { color: "#2563eb" }, // your blue theme
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  useEffect(() => {
    if (plan) {
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
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg text-center border-4 border-blue-300">
        <h1 className="text-4xl font-extrabold text-black mb-4">
          Confirm Your Payment
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          You are purchasing the{" "}
          <span className="font-bold text-blue-600">{plan.duration}</span>{" "}
          premium subscription.
        </p>

        <div
          className="p-6 rounded-2xl shadow-md mb-8"
          style={{
            backgroundColor:
              plan.color === "yellow"
                ? "#fef9c3"
                : plan.color === "green"
                ? "#dcfce7"
                : "#dbeafe",
          }}
        >
          <p className="text-3xl font-extrabold text-black">₹{plan.price}</p>
          <p className="text-gray-700 font-medium mt-1">Total Amount</p>
        </div>

        <button
          onClick={startPayment}
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all text-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <button
          onClick={() => router.push("/subscription")}
          className="block mt-4 text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancel & Go Back
        </button>
      </div>
    </div>
  );
}
