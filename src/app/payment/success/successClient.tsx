"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState({
    paymentId: "",
    orderId: "",
    planId: "",
  });

  useEffect(() => {
    if (!searchParams) return;

    setPaymentData({
      paymentId: searchParams.get("payment_id") || "",
      orderId: searchParams.get("order_id") || "",
      planId: searchParams.get("plan") || "",
    });
  }, [searchParams]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-success/10 text-center p-6">
      <h1 className="text-3xl font-bold text-success">Payment Successful 🎉</h1>
      <p className="text-lg text-muted-foreground mt-3">
        Your payment has been completed successfully.
      </p>

      <div className="mt-4 text-foreground">
        {paymentData.paymentId && (
          <p>
            <strong>Payment ID:</strong> {paymentData.paymentId}
          </p>
        )}
        {paymentData.orderId && (
          <p>
            <strong>Order ID:</strong> {paymentData.orderId}
          </p>
        )}
        {paymentData.planId && (
          <p>
            <strong>Plan:</strong> {paymentData.planId}
          </p>
        )}
      </div>

      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-success text-primary-foreground rounded-xl hover:bg-success/85 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
