"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";

export default function FailedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-danger/10 text-center px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-danger">
        Payment Failed ❌
      </h1>

      <p className="text-base sm:text-lg text-muted-foreground mt-3 max-w-md">
        Something went wrong with your payment. Please try again.
      </p>

      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-danger text-danger-foreground rounded-xl hover:bg-danger/85 transition"
      >
        Try Again
      </Link>
    </div>
  );
}
