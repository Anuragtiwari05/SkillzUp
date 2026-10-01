import type { Metadata } from "next";
import { Map, MessagesSquare, Target, Route } from "lucide-react";
import FeatureSearchLayout from "@/component/layout/FeatureSearchLayout";
import RoadmapClient from "./RoadmapClient";

export const metadata: Metadata = {
  title: "Generate a Learning Roadmap",
  description:
    "Tell SkillzUp what you want to learn and get a structured, stage-by-stage roadmap with curated resources and time estimates.",
};

const STEPS = [
  {
    icon: Target,
    title: "Pick a topic",
    text: "React, Python, System Design, or anything else you want to get good at.",
  },
  {
    icon: MessagesSquare,
    title: "Answer two questions",
    text: "Your current level, your goal, and optionally how many hours a week you have.",
  },
  {
    icon: Route,
    title: "Get your roadmap",
    text: "Ordered stages, hand-picked resources and time estimates you can track in your dashboard.",
  },
];

export default function RoadmapPage() {
  return (
    <FeatureSearchLayout
      eyebrow="Structured Roadmap"
      title="Build a roadmap that fits you"
      description="A personalised, step-by-step learning path in under a minute."
      breadcrumb="Roadmap"
      icon={<Map className="w-7 h-7" />}
      below={
        <section className="px-4 sm:px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center text-2xl sm:text-3xl font-heading font-extrabold text-foreground mb-8">
              How it works
            </h2>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-link">
                      <step.icon className="w-5 h-5" />
                    </span>
                    <span className="eyebrow text-muted-foreground">Step {i + 1}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      }
    >
      <RoadmapClient />
    </FeatureSearchLayout>
  );
}
