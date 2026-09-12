// src/components/Footer.tsx
"use client";

import Link from "next/link";
import { BookOpen, Github, Linkedin, Twitter } from "lucide-react";

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
    title: "Behind the Scenes",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Bookmarks", href: "/bookmarks" },
      { label: "Settings", href: "/settings" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-500 p-2 rounded-full">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-white">SkillzUp</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm max-w-xs">
              Structured roadmaps, curated resources, and an AI assistant to accelerate your growth.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="GitHub" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-heading font-bold text-white mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm">
          <p className="text-gray-500">
            &copy; 2025 SkillzUp. Built with passion for learners worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
