'use client';

import React from "react";
import { useRouter } from "next/navigation";

// Define the Plan type
type Plan = {
  id: string;
  name: string;
  duration: string;
  price: number;
  borderColor: string;
  bgColor: string;
};

// Subscription plans array
const subscriptionPlans: Plan[] = [
  {
    id: "plan6",
    name: "6 Months",
    duration: "6 Months",
    price: 5,
    borderColor: "border-yellow-400",
    bgColor: "bg-yellow-100",
  },
  {
    id: "plan12",
    name: "12 Months",
    duration: "12 Months",
    price: 10,
    borderColor: "border-green-400",
    bgColor: "bg-green-100",
  },
  {
    id: "plan15",
    name: "15 Months",
    duration: "15 Months",
    price: 15,
    borderColor: "border-blue-400",
    bgColor: "bg-blue-100",
  },
];

export default function SubscriptionPage() {
  const router = useRouter();

  // Type-safe handleBuyNow function
  const handleBuyNow = async (plan: Plan) => {
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          amount: plan.price * 100, // Razorpay uses paise
        }),
      });

      const data = await res.json();

      if (!data.order) {
        alert("Failed to create order");
        return;
      }

      // Redirect to payment page with order ID
      router.push(`/payment?order_id=${data.order.id}&plan=${plan.id}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20">
      <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
        Choose Your Subscription Plan
      </h1>
      <p className="text-gray-700 text-lg max-w-2xl text-center mb-16">
        Get full access to premium content and boost your learning journey.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`border-4 ${plan.borderColor} rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center py-10 px-6 bg-white`}
          >
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${plan.bgColor}`}
            >
              <span className="text-3xl font-bold text-black">₹{plan.price}</span>
            </div>

            <h3 className="text-2xl font-black mb-2">{plan.duration}</h3>

            <p className="text-gray-700 font-semibold mb-6 text-center">
              Access all premium resources during this period
            </p>

            <button
              onClick={() => handleBuyNow(plan)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
