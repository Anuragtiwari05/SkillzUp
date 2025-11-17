"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-green-50 text-center p-6">
      <h1 className="text-3xl font-bold text-green-700">Payment Successful 🎉</h1>
      <p className="text-lg text-gray-700 mt-3">
        Your payment has been completed successfully.
      </p>

      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
