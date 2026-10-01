"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import Reveal from "@/component/ui/Reveal";
import RoadmapFlow from "@/component/roadmaps/RoadmapFlow";
import RoadmapAccordion from "@/component/roadmaps/RoadmapAccordion";
import { getRoadmap } from "@/data/roadmaps";

export default function RoadmapDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const roadmap = getRoadmap(params.slug);

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-24">
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-4">Roadmap not found</h1>
            <button
              onClick={() => router.push("/roadmaps")}
              className="text-link hover:text-link font-semibold"
            >
              Back to Roadmaps
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <Reveal className="mb-10">
            <button
              onClick={() => router.push("/roadmaps")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-link mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Roadmaps
            </button>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4">
              {roadmap.title}
            </h1>
            <p className="text-muted-foreground max-w-2xl">{roadmap.description}</p>
            <p className="text-xs text-muted-foreground mt-4">
              Click any node in the diagram (or expand a row below) to see details and resources.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mb-10">
            <RoadmapFlow nodes={roadmap.nodes} />
          </Reveal>

          <Reveal delay={0.15}>
            <h2 className="text-lg font-heading font-bold text-foreground mb-4">Topic List</h2>
            <RoadmapAccordion nodes={roadmap.nodes} />
          </Reveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
