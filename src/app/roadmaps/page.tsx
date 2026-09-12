"use client";

import Link from "next/link";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import Card from "@/component/ui/Card";
import Reveal from "@/component/ui/Reveal";
import { ROLE_ROADMAPS, SKILL_ROADMAPS, countTopics } from "@/data/roadmaps";
import { getRoadmapIcon } from "@/data/roadmaps/iconMap";
import type { RoadmapData } from "@/data/roadmaps/types";

function RoadmapCard({ roadmap, delay }: { roadmap: RoadmapData; delay: number }) {
  const Icon = getRoadmapIcon(roadmap.icon);
  const topicCount = countTopics(roadmap.nodes);

  return (
    <Reveal delay={delay}>
      <Link href={`/roadmaps/${roadmap.slug}`} className="h-full block">
        <Card className="p-5 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary-50 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-heading font-bold text-neutral-900">{roadmap.title}</h3>
          </div>
          <p className="text-sm text-neutral-600 mb-4 flex-1">{roadmap.description}</p>
          <span className="text-xs font-semibold text-neutral-500">{topicCount} topics</span>
        </Card>
      </Link>
    </Reveal>
  );
}

export default function RoadmapsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <Reveal className="text-center mb-16">
            <p className="eyebrow text-primary-600 mb-3">Roadmaps</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-neutral-900 mb-4">
              Developer Roadmaps
            </h1>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Community-style roadmaps to guide your learning path — pick a role
              or a specific skill and see exactly what to learn, in order.
            </p>
          </Reveal>

          <Reveal className="mb-6">
            <h2 className="text-lg font-heading font-bold text-neutral-900 flex items-center gap-2">
              <span className="bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                Role-based
              </span>
              Role-based Roadmaps
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {ROLE_ROADMAPS.map((r, idx) => (
              <RoadmapCard key={r.slug} roadmap={r} delay={Math.min(idx * 0.04, 0.3)} />
            ))}
          </div>

          <Reveal className="mb-6">
            <h2 className="text-lg font-heading font-bold text-neutral-900 flex items-center gap-2">
              <span className="bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                Skill-based
              </span>
              Skill-based Roadmaps
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SKILL_ROADMAPS.map((r, idx) => (
              <RoadmapCard key={r.slug} roadmap={r} delay={Math.min(idx * 0.04, 0.3)} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
