"use client";

import { useState } from "react";
import { X } from "lucide-react";
import PaymentButton from "./paymentButton";

export default function PaymentModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Subscribe
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Choose Your Plan</h2>
            <p className="text-gray-600 mb-6">Get unlimited access to premium content.</p>
            <PaymentButton />
          </div>
        </div>
      )}
    </>
  );
}
