"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");

  const subscriptionPlans: any = {
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

    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      body: JSON.stringify({ planId }),
    });

    const data = await res.json();
    if (!data.success) {
      alert("Payment error: " + data.error);
      return;
    }

    const order = data.order;

    const loaded: any = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay failed to load");
      return;
    }
console.log("🔑 Frontend Razorpay Key =", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

   const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: order.amount,
  currency: order.currency,
  name: "SkillzUp Premium",
  description: `${plan.duration} Subscription`,
  order_id: order.id,

  // ✅ ADD THIS BLOCK
  prefill: {
    name: "SkillzUp User",
    email: "user@example.com",
    contact: "9999999999",
  },

  theme: { color: "#2563eb" },

  handler: function () {
    router.push("/payment/success");
  },
};


    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
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
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg text-center border-4 border-blue-300">
        <h1 className="text-4xl font-extrabold text-black mb-4">
          Processing Your Payment...
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          You are purchasing the{" "}
          <span className="font-bold text-blue-600">{plan.duration}</span>{" "}
          subscription. Please wait.
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

        <p className="text-gray-500 text-sm mt-2">
          Please wait while we redirect you to Razorpay...
        </p>

        <button
          onClick={() => router.push("/")}
          className="block mt-6 text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancel & Go Back
        </button>
      </div>
    </div>
  );
}
