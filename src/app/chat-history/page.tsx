"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import AppShell from "@/component/AppShell";
import Card from "@/component/ui/Card";
import Reveal from "@/component/ui/Reveal";
import Loader from "@/component/ui/Loader";
import ConversationRow from "@/component/ConversationRow";
import { groupByDate } from "@/lib/dateGroups";

type Session = {
  sessionId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  messages: { role: string; content: string }[];
};

export default function ChatHistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[] | null>(null);

  useEffect(() => {
    fetch("/api/chat", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSessions(data);
      });
  }, []);

  const remove = async (sessionId: string) => {
    setSessions((prev) => (prev ? prev.filter((s) => s.sessionId !== sessionId) : prev));
    await fetch(`/api/chat/${sessionId}`, { method: "DELETE", credentials: "include" });
  };

  const groups = sessions ? groupByDate(sessions, (s) => s.updatedAt || s.createdAt) : [];

  return (
    <AppShell active="chat-history" title="Chat History">
      {sessions === null && <Loader size="lg" label="Loading your conversations..." />}

      {sessions !== null && sessions.length === 0 && (
        <Reveal>
          <Card hover={false} className="p-10 text-center">
            <MessageSquare className="w-10 h-10 text-primary-500 mx-auto mb-4" />
            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-2">
              No conversations yet
            </h2>
            <p className="text-neutral-600">Start a chat with the AI assistant to see it here.</p>
          </Card>
        </Reveal>
      )}

      {groups.map((group, gIdx) => (
        <div key={group.label} className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wide text-neutral-600 mb-3">
            {group.label}
          </h2>
          <div className="space-y-3">
            {group.items.map((s, idx) => (
              <Reveal key={s.sessionId} delay={Math.min((gIdx * 3 + idx) * 0.04, 0.3)}>
                <ConversationRow
                  title={s.title || "Untitled conversation"}
                  date={s.updatedAt || s.createdAt}
                  messageCount={s.messages.length}
                  onOpen={() => router.push(`/chat?session=${s.sessionId}`)}
                  onDelete={() => remove(s.sessionId)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </AppShell>
  );
}
