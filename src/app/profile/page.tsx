"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Map, Youtube, MessageSquare, Mail, CreditCard } from "lucide-react";
import AppShell from "@/component/AppShell";
import Card from "@/component/ui/Card";
import Reveal from "@/component/ui/Reveal";
import Loader from "@/component/ui/Loader";

type UserInfo = {
  name: string;
  email: string;
  isPremium: boolean;
  plan: string | null;
  expiresAt: string | null;
};

type Activity = {
  lastRoadmap?: { id: string; topic: string; viewedAt: string };
  lastFeatureView?: { type: string; url: string; title: string; viewedAt: string };
  lastChatSession?: { id: string; title: string; viewedAt: string };
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    fetch("/api/user/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => data.success && setUser(data.user));

    fetch("/api/activity", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => data.success && setActivity(data.activity));

    fetch("/api/streak", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => data.success && setStreak(data.streak.currentStreak));
  }, []);

  return (
    <AppShell active="profile" title="Profile / Activity">
      {!user && <Loader size="lg" label="Loading your profile..." />}

      {user && (
        <div className="space-y-8">
          <Reveal>
            <Card hover={false} className="p-6 sm:p-8">
              <h2 className="font-heading font-bold text-xl text-foreground mb-4">{user.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-link" /> {user.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="w-4 h-4 text-link" />
                  {user.isPremium ? `${user.plan ?? "Premium"} — active` : "No active subscription"}
                </div>
                <div className="flex items-center gap-2 font-bold text-accent-text">
                  <Flame className="w-4 h-4" /> {streak}-day streak
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="font-heading font-bold text-lg text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {!activity && (
                <p className="text-muted-foreground text-sm">No activity yet — go generate a roadmap or chat with the AI.</p>
              )}

              {activity?.lastRoadmap && (
                <Card
                  hover={false}
                  className="p-5 flex items-center gap-4 cursor-pointer"
                  onClick={() => router.push(`/dashboard/${activity.lastRoadmap!.id}`)}
                >
                  <Map className="w-5 h-5 text-link flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      Last roadmap: {activity.lastRoadmap.topic}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.lastRoadmap.viewedAt).toLocaleString()}
                    </p>
                  </div>
                </Card>
              )}

              {activity?.lastFeatureView && (
                <a href={activity.lastFeatureView.url} target="_blank" rel="noopener noreferrer" className="block">
                  <Card hover={false} className="p-5 flex items-center gap-4">
                    <Youtube className="w-5 h-5 text-link flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        Last {activity.lastFeatureView.type}: {activity.lastFeatureView.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.lastFeatureView.viewedAt).toLocaleString()}
                      </p>
                    </div>
                  </Card>
                </a>
              )}

              {activity?.lastChatSession && (
                <Card
                  hover={false}
                  className="p-5 flex items-center gap-4 cursor-pointer"
                  onClick={() => router.push(`/chat?session=${activity.lastChatSession!.id}`)}
                >
                  <MessageSquare className="w-5 h-5 text-link flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      Last chat: {activity.lastChatSession.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.lastChatSession.viewedAt).toLocaleString()}
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </Reveal>
        </div>
      )}
    </AppShell>
  );
}
