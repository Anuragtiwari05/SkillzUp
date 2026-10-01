import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Track your learning roadmaps, progress and streaks on your SkillzUp dashboard.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
