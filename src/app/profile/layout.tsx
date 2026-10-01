import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Profile and Activity",
  description:
    "See your learning activity, streaks and account details on SkillzUp.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
