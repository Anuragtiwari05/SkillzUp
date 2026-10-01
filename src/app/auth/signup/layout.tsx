import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create a free SkillzUp account and generate your first personalised learning roadmap.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
