import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the SkillzUp team with questions, feedback or partnership ideas.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
