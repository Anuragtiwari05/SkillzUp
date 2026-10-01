"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import AppShell from "@/component/AppShell";
import Card from "@/component/ui/Card";
import Reveal from "@/component/ui/Reveal";
import { useTheme } from "@/context/ThemeContext";

const OPTIONS = [
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "dark" as const, label: "Dark", icon: Moon },
  { value: "system" as const, label: "System", icon: Monitor },
];

export default function SettingsPage() {
  const { preference, setPreference } = useTheme();

  return (
    <AppShell active="settings" title="Settings">
      <Reveal>
        <Card hover={false} className="p-6 sm:p-8">
          <h2 className="font-heading font-bold text-lg text-foreground mb-1">Appearance</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Choose how SkillzUp looks on this device. Your choice is saved and synced to your account.
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md">
            {OPTIONS.map((opt) => {
              const selected = preference === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setPreference(opt.value)}
                  className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 font-semibold text-sm transition-colors ${
                    selected
                      ? "border-primary bg-primary/15 text-link"
                      : "border-border bg-surface text-muted-foreground hover:border-primary"
                  }`}
                >
                  <opt.icon className="w-5 h-5" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </Card>
      </Reveal>
    </AppShell>
  );
}
