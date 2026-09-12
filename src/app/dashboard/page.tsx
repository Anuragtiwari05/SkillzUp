"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Map, MessageSquare } from "lucide-react";
import AppShell from "@/component/AppShell";
import Card from "@/component/ui/Card";
import Reveal from "@/component/ui/Reveal";
import Loader from "@/component/ui/Loader";
import ConversationRow from "@/component/ConversationRow";
import { groupByDate } from "@/lib/dateGroups";

type Roadmap = {
  _id: string;
  topic: string;
  skillLevel: string;
  goal: string;
  createdAt: string;
  stages: { completed: boolean }[];
  completionPercent: number;
};

type Session = {
  sessionId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  messages: { role: string; content: string }[];
};

const GOAL_LABEL: Record<string, string> = {
  job: "Get a job",
  hobby: "Hobby",
  exam: "Exam prep",
};

export default function DashboardPage() {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<Roadmap[] | null>(null);
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/roadmaps", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRoadmaps(data.roadmaps);
      });

    fetch("/api/chat", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSessions(data);
      });

    fetch("/api/streak", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStreak(data.streak.currentStreak);
      });
  }, []);

  const removeSession = async (sessionId: string) => {
    setSessions((prev) => (prev ? prev.filter((s) => s.sessionId !== sessionId) : prev));
    await fetch(`/api/chat/${sessionId}`, { method: "DELETE", credentials: "include" });
  };

  const sessionGroups = sessions ? groupByDate(sessions, (s) => s.updatedAt || s.createdAt) : [];

  return (
    <AppShell active="dashboard" title="Dashboard">
      {streak !== null && streak > 0 && (
        <Reveal className="mb-8">
          <div className="inline-flex items-center gap-2 bg-accent-50 text-accent-600 font-bold px-4 py-2 rounded-full">
            <Flame className="w-5 h-5" /> {streak}-day streak
          </div>
        </Reveal>
      )}

      <section className="mb-12">
        <h2 className="text-lg font-heading font-bold text-neutral-900 mb-4">Your Roadmaps</h2>

        {roadmaps === null && <Loader size="lg" label="Loading your roadmaps..." />}

        {roadmaps !== null && roadmaps.length === 0 && (
          <Reveal>
            <Card hover={false} className="p-10 text-center">
              <Map className="w-10 h-10 text-primary-500 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl text-neutral-900 mb-2">
                No roadmaps yet
              </h3>
              <p className="text-neutral-600 mb-6">
                Generate your first personalized roadmap to see it here.
              </p>
              <Link
                href="/features/roadmap"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-bold bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Create a Roadmap
              </Link>
            </Card>
          </Reveal>
        )}

        {roadmaps !== null && roadmaps.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((r, idx) => (
              <Reveal key={r._id} delay={Math.min(idx * 0.06, 0.3)}>
                <Link href={`/dashboard/${r._id}`}>
                  <Card className="p-6 h-full flex flex-col">
                    <h3 className="font-heading font-bold text-lg text-neutral-900 mb-2">{r.topic}</h3>
                    <div className="flex gap-2 flex-wrap mb-4">
                      <span className="text-xs font-bold uppercase tracking-wide bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full">
                        {r.skillLevel}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wide bg-accent-50 text-accent-600 px-2.5 py-1 rounded-full">
                        {GOAL_LABEL[r.goal] ?? r.goal}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between text-sm text-neutral-600 mb-1">
                        <span>{r.stages.length} stages</span>
                        <span>{r.completionPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-600 rounded-full transition-all"
                          style={{ width: `${r.completionPercent}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-heading font-bold text-neutral-900 mb-4">Recent Conversations</h2>

        {sessions === null && <Loader size="lg" label="Loading your conversations..." />}

        {sessions !== null && sessions.length === 0 && (
          <Reveal>
            <Card hover={false} className="p-10 text-center">
              <MessageSquare className="w-10 h-10 text-primary-500 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl text-neutral-900 mb-2">No conversations yet</h3>
              <p className="text-neutral-600">Start a chat with the AI assistant to see it here.</p>
            </Card>
          </Reveal>
        )}

        {sessionGroups.map((group, gIdx) => (
          <div key={group.label} className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wide text-neutral-600 mb-3">
              {group.label}
            </h3>
            <div className="space-y-3">
              {group.items.map((s, idx) => (
                <Reveal key={s.sessionId} delay={Math.min((gIdx * 3 + idx) * 0.04, 0.3)}>
                  <ConversationRow
                    title={s.title || "Untitled conversation"}
                    date={s.updatedAt || s.createdAt}
                    messageCount={s.messages.length}
                    onOpen={() => router.push(`/chat?session=${s.sessionId}`)}
                    onDelete={() => removeSession(s.sessionId)}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
