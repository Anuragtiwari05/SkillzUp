import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Bookmarks",
  description:
    "Your saved videos, articles and news from SkillzUp, all in one place.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
