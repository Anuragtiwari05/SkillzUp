"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label = "Back", className = "" }: { label?: string; className?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      aria-label={label || "Go back"}
      className={`inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-link transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4" /> {label && <span>{label}</span>}
    </button>
  );
}
