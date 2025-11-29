"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";

export default function FailedPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-red-50 text-center p-6">
      <h1 className="text-3xl font-bold text-red-700">Payment Failed ❌</h1>
      <p className="text-lg text-gray-700 mt-3">
        Something went wrong with your payment. Please try again.
      </p>

      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
      >
        Try Again
      </Link>
    </div>
  );
}
