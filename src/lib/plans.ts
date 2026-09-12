export type PlanId = "plan_monthly" | "plan6" | "plan12";

export interface Plan {
  id: PlanId;
  name: string;
  months: number;
  price: number; // total price in INR for the whole period
  badge?: string;
  savingsLabel?: string;
}

export const PLANS: Record<PlanId, Plan> = {
  plan_monthly: {
    id: "plan_monthly",
    name: "Monthly",
    months: 1,
    price: 79,
  },
  plan6: {
    id: "plan6",
    name: "6 Months",
    months: 6,
    price: 349,
    savingsLabel: "Save ~26%",
  },
  plan12: {
    id: "plan12",
    name: "Annual",
    months: 12,
    price: 599,
    badge: "Best Value",
    savingsLabel: "Save ~37%",
  },
};

export const PLAN_LIST: Plan[] = Object.values(PLANS);

export const PAID_FEATURES: string[] = [
  "Full access to every learning roadmap",
  "Unlimited AI chatbot conversations",
  "Priority chatbot response speed",
  "Ad-free browsing across the platform",
  "Full chat history saved across sessions",
];

export function perMonthPrice(plan: Plan): number {
  return Math.round((plan.price / plan.months) * 100) / 100;
}

export function getPlanByAmount(amountInRupees: number): Plan | undefined {
  return PLAN_LIST.find((p) => p.price === amountInRupees);
}
