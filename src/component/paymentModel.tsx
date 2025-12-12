"use client";

import { useState } from "react";
import { X } from "lucide-react";
import PaymentButton from "./paymentButton";

export default function PaymentModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Subscribe Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold"
      >
        Subscribe
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-6">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md relative animate-fade-in">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800 text-center">
              Choose Your Plan
            </h2>
            <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
              Get unlimited access to premium content and boost your learning journey.
            </p>

            {/* Payment Button */}
            <div className="flex justify-center">
              <PaymentButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
