"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    label: "Web Development",
    topics: [
      { title: "Frontend", href: "/roadmaps/frontend" },
      { title: "React", href: "/roadmaps/react" },
      { title: "Next.js", href: "/roadmaps/nextjs" },
      { title: "JavaScript", href: "/roadmaps/javascript" },
      { title: "TypeScript", href: "/roadmaps/typescript" },
    ],
  },
  {
    label: "Data & AI",
    topics: [
      { title: "Python", href: "/roadmaps/python" },
      { title: "Data Analyst", href: "/roadmaps/data-analyst" },
      { title: "Machine Learning", href: "/roadmaps/machine-learning" },
      { title: "AI Engineer", href: "/roadmaps/ai-engineer" },
      { title: "Data Engineer", href: "/roadmaps/data-engineer" },
    ],
  },
  {
    label: "Systems & Cloud",
    topics: [
      { title: "System Design", href: "/roadmaps/system-design" },
      { title: "DevOps", href: "/roadmaps/devops" },
      { title: "Docker", href: "/roadmaps/docker" },
      { title: "Kubernetes", href: "/roadmaps/kubernetes" },
      { title: "AWS", href: "/roadmaps/aws" },
    ],
  },
  {
    label: "Design & QA",
    topics: [
      { title: "UX Design", href: "/roadmaps/ux-design" },
      { title: "QA", href: "/roadmaps/qa" },
      { title: "Software Architect", href: "/roadmaps/software-architect" },
      { title: "Cyber Security", href: "/roadmaps/cyber-security" },
    ],
  },
];

export default function CategoryTabs() {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
        {CATEGORIES.map((cat, idx) => (
          <button
            key={cat.label}
            onClick={() => setActive(idx)}
            className={`px-4 sm:px-5 py-2.5 rounded-full font-bold text-sm sm:text-base transition-colors ${
              active === idx
                ? "bg-primary-600 text-white"
                : "bg-surface border border-surface-border text-neutral-700 hover:border-primary-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto"
        >
          {CATEGORIES[active].topics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="group flex items-center justify-between gap-2 bg-surface border border-surface-border rounded-2xl px-4 py-3 font-semibold text-sm text-neutral-800 hover:border-primary-400 hover:text-primary-700 transition-colors"
            >
              {topic.title}
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
