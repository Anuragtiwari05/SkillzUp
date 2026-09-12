"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, LayoutDashboard, BookOpen, Clock } from "lucide-react";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import BackButton from "@/component/ui/BackButton";
import Loader from "@/component/ui/Loader";
import Reveal from "@/component/ui/Reveal";
import Button from "@/component/ui/Button";
import Card from "@/component/ui/Card";
import { useAuth } from "@/hooks/useAuth";

type SkillLevel = "beginner" | "intermediate" | "advanced";
type Goal = "job" | "hobby" | "exam";
type TimeAvailability = "lt2" | "2to5" | "5plus";

type Stage = {
  title: string;
  description: string;
  estimatedTime?: string;
  resources: { title: string; url: string; type?: string }[];
};

type RoadmapResult = {
  roadmapId: string;
  topic: string;
  overview: string;
  stages: Stage[];
};

const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const GOALS: { value: Goal; label: string }[] = [
  { value: "job", label: "Get a job" },
  { value: "hobby", label: "Personal hobby" },
  { value: "exam", label: "Pass an exam / certification" },
];

const TIMES: { value: TimeAvailability; label: string }[] = [
  { value: "lt2", label: "< 2 hrs / week" },
  { value: "2to5", label: "2-5 hrs / week" },
  { value: "5plus", label: "5+ hrs / week" },
];

function OptionCard({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 font-semibold text-xs sm:text-base text-center leading-tight transition-colors ${
        selected
          ? "border-primary-600 bg-primary-50 text-primary-700"
          : "border-neutral-200 bg-surface text-neutral-700 hover:border-primary-300"
      }`}
    >
      {label}
    </button>
  );
}

export default function RoadmapPage() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();

  const [step, setStep] = useState<"topic" | "quiz" | "result">("topic");
  const [topic, setTopic] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [timeAvailability, setTimeAvailability] = useState<TimeAvailability | null>(null);

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RoadmapResult | null>(null);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push(`/auth/login?redirect=${encodeURIComponent("/features/roadmap")}`);
    }
  }, [authLoading, isLoggedIn, router]);

  const handleGenerate = async () => {
    if (!topic || !skillLevel || !goal) return;
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/features/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, skillLevel, goal, timeAvailability }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        setGenerating(false);
        return;
      }

      setResult(data);
      setStep("result");
    } catch (err) {
      console.error("Roadmap generation failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const resetWizard = () => {
    setStep("topic");
    setTopic("");
    setSkillLevel(null);
    setGoal(null);
    setTimeAvailability(null);
    setResult(null);
    setError("");
  };

  if (authLoading || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader size="lg" label="Checking your session..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16 w-full">
        <BackButton className="mb-8" />
        {step === "topic" && (
          <Reveal className="text-center">
            <p className="eyebrow text-primary-600 mb-3">Step 1 of 2</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-neutral-900 mb-6">
              What do you want to learn?
            </h1>
            <p className="text-neutral-600 mb-8">
              Tell us the skill or topic, and we'll ask two quick questions to build a roadmap that actually fits you.
            </p>

            <Card hover={false} className="p-6 sm:p-8 max-w-xl mx-auto">
              <input
                type="text"
                autoFocus
                placeholder="e.g. React, Data Structures, UI Design..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && topic && setStep("quiz")}
                className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none text-neutral-900 text-base sm:text-lg font-medium mb-6"
              />
              <Button
                disabled={!topic.trim()}
                onClick={() => setStep("quiz")}
                className="w-full"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </Card>
          </Reveal>
        )}

        {step === "quiz" && (
          <Reveal>
            <p className="eyebrow text-primary-600 mb-3 text-center">Step 2 of 2</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-neutral-900 mb-8 text-center">
              A couple quick questions
            </h1>

            <Card hover={false} className="p-6 sm:p-8 space-y-8">
              <div>
                <h3 className="font-heading font-bold text-neutral-900 mb-3">What's your current skill level?</h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {SKILL_LEVELS.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      label={opt.label}
                      selected={skillLevel === opt.value}
                      onClick={() => setSkillLevel(opt.value)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-heading font-bold text-neutral-900 mb-3">What's your goal?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {GOALS.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      label={opt.label}
                      selected={goal === opt.value}
                      onClick={() => setGoal(opt.value)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-heading font-bold text-neutral-900 mb-3">
                  Time availability <span className="text-neutral-600 font-normal">(optional)</span>
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {TIMES.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      label={opt.label}
                      selected={timeAvailability === opt.value}
                      onClick={() =>
                        setTimeAvailability(timeAvailability === opt.value ? null : opt.value)
                      }
                    />
                  ))}
                </div>
              </div>

              {error && <p className="text-red-600 font-medium text-sm text-center">{error}</p>}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("topic")} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!skillLevel || !goal || generating}
                  className="flex-1"
                >
                  {generating ? "Generating..." : "Generate My Roadmap"}
                </Button>
              </div>
            </Card>
          </Reveal>
        )}

        {step === "result" && generating && <Loader size="lg" label="Building your personalized roadmap..." />}

        {step === "result" && result && (
          <div className="space-y-8 sm:space-y-10">
            <Reveal className="text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-neutral-900 mb-4">
                Your Roadmap: {result.topic}
              </h2>
              {result.overview && (
                <p className="text-neutral-600 max-w-2xl mx-auto mb-4">{result.overview}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => router.push(`/dashboard/${result.roadmapId}`)}>
                  <LayoutDashboard className="w-4 h-4" /> Track Progress in Dashboard
                </Button>
                <Button variant="outline" onClick={resetWizard}>
                  Generate Another
                </Button>
              </div>
            </Reveal>

            {result.stages.map((stage, idx) => (
              <Reveal key={idx} delay={Math.min(idx * 0.06, 0.3)}>
                <Card hover={false} className="relative p-4 sm:p-6 md:p-8">
                  <div className="absolute -left-4 sm:-left-5 top-6 w-8 h-8 sm:w-9 sm:h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {idx + 1}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 sm:mb-3 flex items-center gap-2 text-neutral-900">
                    <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-primary-600" />
                    {stage.title}
                  </h3>

                  <p className="text-neutral-700 mb-3 sm:mb-4 leading-relaxed text-base sm:text-lg">
                    {stage.description}
                  </p>

                  {stage.resources?.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <h4 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-neutral-900 mb-1 sm:mb-2">
                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" /> Recommended Resources
                      </h4>
                      <ul className="list-disc ml-5 sm:ml-6 space-y-1">
                        {stage.resources.map((res, i) => (
                          <li key={i}>
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-700 hover:underline font-medium text-sm sm:text-base"
                            >
                              {res.title} {res.type ? `(${res.type})` : ""}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {stage.estimatedTime && (
                    <p className="flex items-center gap-1.5 text-sm sm:text-base text-neutral-600 mt-1 sm:mt-2">
                      <Clock className="w-4 h-4" /> Estimated Time: <span className="font-semibold">{stage.estimatedTime}</span>
                    </p>
                  )}
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
