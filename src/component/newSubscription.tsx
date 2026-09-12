'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import Card from "@/component/ui/Card";
import Button from "@/component/ui/Button";
import Reveal from "@/component/ui/Reveal";
import { checkAuthNow } from "@/hooks/useAuth";
import { PLAN_LIST, PAID_FEATURES, perMonthPrice, type Plan } from "@/lib/plans";

export default function Subscription() {
  const router = useRouter();
  const [checkingPlanId, setCheckingPlanId] = useState<string | null>(null);

  const handleBuyNow = async (plan: Plan) => {
    setCheckingPlanId(plan.id);
    try {
      const destination = `/payment?plan=${plan.id}`;
      const isLoggedIn = await checkAuthNow();

      if (!isLoggedIn) {
        router.push(`/auth/login?redirect=${encodeURIComponent(destination)}`);
        return;
      }

      router.push(destination);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating order");
    } finally {
      setCheckingPlanId(null);
    }
  };

  return (
    <div className="py-16 sm:py-24 flex flex-col items-center px-4" id="pricing">
      <Reveal className="text-center">
        <p className="eyebrow text-primary-600 mb-3">Pricing</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-neutral-900 mb-4">
          Choose Your Subscription Plan
        </h2>
        <p className="text-neutral-600 text-base md:text-lg max-w-2xl mx-auto mb-12">
          Get full access to premium content and boost your learning journey.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl items-stretch">
        {PLAN_LIST.map((plan, idx) => {
          const isFeatured = Boolean(plan.badge);
          const perMonth = perMonthPrice(plan);

          return (
            <Reveal key={plan.id} delay={idx * 0.08} className="h-full">
              <Card
                hover
                className={`relative flex flex-col h-full py-10 px-6 ${
                  isFeatured
                    ? "border-2 border-primary-500 shadow-[0_20px_40px_-16px_rgba(0,153,122,0.35)]"
                    : ""
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-bold uppercase tracking-wide px-4 py-1 rounded-full shadow-md">
                    {plan.badge}
                  </span>
                )}

                <div className="flex flex-col items-center text-center flex-1">
                  <h3 className="text-lg md:text-xl font-heading font-bold text-neutral-900 mb-4">
                    {plan.name}
                  </h3>

                  <div className="mb-1">
                    <span className="text-3xl md:text-4xl font-heading font-extrabold text-primary-700">
                      ₹{plan.price}
                    </span>
                    <span className="text-neutral-600 font-medium text-sm"> / {plan.months === 1 ? "month" : `${plan.months} months`}</span>
                  </div>

                  <p className="text-neutral-600 text-sm mb-2">
                    {plan.months === 1 ? "billed monthly" : `≈ ₹${perMonth} per month`}
                  </p>

                  {plan.savingsLabel && (
                    <span className="inline-block bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                      {plan.savingsLabel}
                    </span>
                  )}

                  <ul className="text-left w-full space-y-2 mt-4 mb-8">
                    {PAID_FEATURES.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-neutral-700">
                        <Check className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="primary"
                  onClick={() => handleBuyNow(plan)}
                  disabled={checkingPlanId === plan.id}
                  className="w-full mt-auto hover:!bg-accent-500"
                >
                  {checkingPlanId === plan.id ? "Checking..." : "Buy Now"}
                </Button>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
