'use client';

import { useState } from "react";

export default function PaymentButton() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1️⃣ Create order on backend
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 49900, currency: "INR" }), // amount in paise (₹499)
      });

      const data = await res.json();
      if (!data.order) throw new Error("Failed to create order");

      // 2️⃣ Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "SkillzUp",
        description: "SkillzUp Premium Access",
        order_id: data.order.id,
        handler: function (response: any) {
          alert(`✅ Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          window.location.href = "/payment/success";
        },
        prefill: {
          name: "Anurag Tiwari",
          email: "anurag@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#2563EB", // Tailwind blue-600
        },
      };

      // 3️⃣ Load Razorpay script dynamically
      const razorpayScript = document.createElement("script");
      razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
      razorpayScript.onload = () => {
        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(razorpayScript);
    } catch (err) {
      console.error("❌ Payment failed:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50"
    >
      {loading ? "Processing..." : "Pay ₹499"}
    </button>
  );
}
