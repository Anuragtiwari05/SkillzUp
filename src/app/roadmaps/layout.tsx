import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Roadmaps Library",
  description:
    "Browse SkillzUp's library of learning roadmaps for frontend, Python, system design, AI, DevOps and more.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
