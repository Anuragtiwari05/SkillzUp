import { Suspense } from "react";
import PaymentClient from "./paymentClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PaymentClient />
    </Suspense>
  );
}
