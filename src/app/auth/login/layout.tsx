import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Log in to SkillzUp to continue your learning journey.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
