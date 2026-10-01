import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Chat History",
  description:
    "Revisit your previous conversations with the SkillzUp AI assistant.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
