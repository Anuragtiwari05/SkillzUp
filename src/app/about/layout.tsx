import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn what SkillzUp is, why we built it, and how it helps learners master new skills with roadmaps, curated content and an AI assistant.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
