'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import Card from "@/component/ui/Card";
import Button from "@/component/ui/Button";
import Reveal from "@/component/ui/Reveal";
import RevealHeading from "@/component/motion/RevealHeading";
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
        <p className="eyebrow text-link mb-3">Pricing</p>
        <RevealHeading as="h2" className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4">
          Choose Your Subscription Plan
        </RevealHeading>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-12">
          Get full access to premium content and boost your learning journey.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl items-stretch">
        {PLAN_LIST.map((plan, idx) => {
          const isFeatured = Boolean(plan.badge);
          const perMonth = perMonthPrice(plan);

          return (
            <Reveal key={plan.id} delay={idx * 0.08} className="h-full">
              <div className="relative h-full">
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wide px-4 py-1 rounded-full shadow-md">
                    {plan.badge}
                  </span>
                )}
              <div className={`relative h-full rounded-[calc(var(--radius-card)+2px)] ${isFeatured ? "p-[2px] overflow-hidden" : ""}`}>
                {isFeatured && (
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow"
                    style={{
                      background:
                        "conic-gradient(from 0deg, var(--primary), var(--accent), transparent 40%, var(--primary))",
                    }}
                  />
                )}
                <Card
                  hover
                  className={`grain relative flex flex-col h-full py-10 px-6 ${
                    isFeatured ? "border-transparent bg-surface" : ""
                  }`}
                >
                  <div className="flex flex-col items-center text-center flex-1">
                    <h3 className="text-lg md:text-xl font-heading font-bold text-foreground mb-4">
                      {plan.name}
                    </h3>

                    <div className="mb-1">
                      <span className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
                        ₹{plan.price}
                      </span>
                      <span className="text-muted-foreground font-medium text-sm"> / {plan.months === 1 ? "month" : `${plan.months} months`}</span>
                    </div>

                    <p className="text-muted-foreground text-sm mb-2">
                      {plan.months === 1 ? "billed monthly" : `≈ ₹${perMonth} per month`}
                    </p>

                    {plan.savingsLabel && (
                      <span className="inline-block bg-primary/15 text-link text-xs font-bold px-3 py-1 rounded-full mb-4">
                        {plan.savingsLabel}
                      </span>
                    )}

                    <ul className="text-left w-full space-y-2 mt-4 mb-8">
                      {PAID_FEATURES.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-link mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant={isFeatured ? "primary" : "outline"}
                    onClick={() => handleBuyNow(plan)}
                    disabled={checkingPlanId === plan.id}
                    className="w-full mt-auto"
                  >
                    {checkingPlanId === plan.id ? "Checking..." : "Buy Now"}
                  </Button>
                </Card>
              </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
