import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AI Learning Assistant",
  description:
    "Chat with the SkillzUp AI assistant to plan your study routine, find courses and get learning help.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
