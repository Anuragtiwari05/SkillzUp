"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import AppShell from "@/component/AppShell";
import Card from "@/component/ui/Card";
import Reveal from "@/component/ui/Reveal";
import Loader from "@/component/ui/Loader";

type Stage = {
  title: string;
  description: string;
  estimatedTime?: string;
  resources: { title: string; url: string; type?: string }[];
  completed: boolean;
};

type Roadmap = {
  _id: string;
  topic: string;
  skillLevel: string;
  goal: string;
  stages: Stage[];
  completionPercent: number;
};

export default function RoadmapDetailPage() {
  const params = useParams<{ id: string }>();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/roadmaps/${params.id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRoadmap(data.roadmap);
      });
  }, [params.id]);

  const toggleStage = async (index: number) => {
    if (!roadmap) return;
    setToggling(index);

    const optimistic = { ...roadmap, stages: [...roadmap.stages] };
    optimistic.stages[index] = { ...optimistic.stages[index], completed: !optimistic.stages[index].completed };
    setRoadmap(optimistic);

    try {
      const res = await fetch(`/api/roadmaps/${params.id}/stages/${index}`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setRoadmap((prev) =>
          prev ? { ...prev, stages: data.stages, completionPercent: data.completionPercent } : prev
        );
      }
    } finally {
      setToggling(null);
    }
  };

  return (
    <AppShell active="dashboard" title={roadmap ? roadmap.topic : "Roadmap"}>
      {!roadmap && <Loader size="lg" label="Loading roadmap..." />}

      {roadmap && (
        <div className="space-y-6">
          <Reveal>
            <Card hover={false} className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-neutral-600">Overall progress</span>
                <span className="text-sm font-bold text-primary-700">{roadmap.completionPercent}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all"
                  style={{ width: `${roadmap.completionPercent}%` }}
                />
              </div>
            </Card>
          </Reveal>

          {roadmap.stages.map((stage, idx) => (
            <Reveal key={idx} delay={Math.min(idx * 0.05, 0.3)}>
              <Card
                hover={false}
                className={`p-5 sm:p-6 flex gap-4 ${stage.completed ? "opacity-70" : ""}`}
              >
                <button
                  onClick={() => toggleStage(idx)}
                  disabled={toggling === idx}
                  className="flex-shrink-0 mt-1"
                  aria-label={stage.completed ? "Mark incomplete" : "Mark complete"}
                >
                  {stage.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-primary-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-neutral-300" />
                  )}
                </button>

                <div className="flex-1">
                  <h3
                    className={`font-heading font-bold text-lg text-neutral-900 mb-1 ${
                      stage.completed ? "line-through" : ""
                    }`}
                  >
                    {idx + 1}. {stage.title}
                  </h3>
                  <p className="text-neutral-600 text-sm sm:text-base mb-2">{stage.description}</p>

                  {stage.resources?.length > 0 && (
                    <ul className="list-disc ml-5 space-y-1">
                      {stage.resources.map((res, i) => (
                        <li key={i}>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-700 hover:underline text-sm font-medium"
                          >
                            {res.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}

                  {stage.estimatedTime && (
                    <p className="flex items-center gap-1.5 text-xs text-neutral-600 mt-2">
                      <Clock className="w-3.5 h-3.5" /> {stage.estimatedTime}
                    </p>
                  )}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      )}
    </AppShell>
  );
}
