"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import SkillzUpWord from "@/component/motion/SkillzUpWord";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Roadmap", href: "/features/roadmap" },
      { label: "Roadmaps Library", href: "/roadmaps" },
      { label: "AI Assistant", href: "/chat" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "For Learners", href: "/auth/signup" },
      { label: "YouTube Picks", href: "/features/yt" },
      { label: "Articles", href: "/features/article" },
      { label: "News", href: "/features/news" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Your Space",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Bookmarks", href: "/bookmarks" },
      { label: "Settings", href: "/settings" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground p-2 rounded-full">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-xl font-heading font-extrabold text-foreground">
                <SkillzUpWord variant="tilt" />
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm max-w-xs">
              Structured roadmaps, curated resources, and an AI assistant to accelerate your growth.
            </p>
            <Link
              href="/contact"
              className="inline-flex text-sm font-semibold text-link hover:underline underline-offset-4"
            >
              Say hello &rarr;
            </Link>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-heading font-bold text-foreground mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-link transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm">
          <p className="text-muted-foreground" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} SkillzUp. Built with passion for learners worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
