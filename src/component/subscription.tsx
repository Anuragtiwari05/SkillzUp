"use client";

import { useState } from "react";
import PaymentModal from "./paymentModel";

const plans = [
  { id: "basic", name: "Basic", price: "₹199/month", description: "Access limited content" },
  { id: "pro", name: "Pro", price: "₹499/month", description: "Full access to all features" },
  { id: "premium", name: "Premium", price: "₹899/month", description: "Everything + early access" },
];

export default function SubscriptionSelector() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="p-6 grid sm:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <div
          key={plan.id}
          onClick={() => setSelectedPlan(plan.id)}
          className={`border rounded-xl p-4 cursor-pointer hover:shadow-lg transition ${
            selectedPlan === plan.id ? "border-blue-600 shadow-md" : "border-gray-200"
          }`}
        >
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className="text-gray-600 mt-1">{plan.description}</p>
          <p className="text-blue-600 font-bold mt-3">{plan.price}</p>
        </div>
      ))}

      {selectedPlan && (
        <div className="col-span-full flex justify-center mt-6">
          <PaymentModal />
        </div>
      )}
    </div>
  );
}
