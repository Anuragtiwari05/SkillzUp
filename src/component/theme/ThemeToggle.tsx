"use client";

import { useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const SPRING = { type: "spring", stiffness: 170, damping: 19, mass: 1 } as const; // ~450ms settle
const RAYS = Array.from({ length: 8 }, (_, i) => i * 45);

/** Sun whose rays retract + rotate while a crescent mask slides in to form the moon. */
function SunMoonIcon({ isDark, reduce }: { isDark: boolean; reduce: boolean }) {
  const t = reduce ? { duration: 0 } : SPRING;
  const maskId = `sz-moon-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="#fff" />
          <motion.circle
            r="7"
            fill="#000"
            initial={false}
            animate={{ cx: isDark ? 17 : 32, cy: isDark ? 7 : 0 }}
            transition={t}
          />
        </mask>
      </defs>
      <motion.g
        initial={false}
        animate={{ rotate: isDark ? 40 : 0 }}
        transition={t}
        style={{ originX: "12px", originY: "12px" }}
      >
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          mask={`url(#${maskId})`}
          initial={false}
          animate={{ r: isDark ? 9 : 5 }}
          transition={t}
        />
        {RAYS.map((deg) => (
          <g key={deg} transform={`rotate(${deg} 12 12)`}>
            <motion.line
              x1="12"
              x2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={false}
              animate={{ y1: isDark ? 9 : 2.5, y2: isDark ? 9 : 5, opacity: isDark ? 0 : 1 }}
              transition={t}
            />
          </g>
        ))}
      </motion.g>
    </svg>
  );
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setPreference } = useTheme();
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => setMounted(true), []);

  const base =
    "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground";

  // Same-size placeholder avoids hydration mismatch.
  if (!mounted) return <span aria-hidden className={`${base} ${className}`} />;

  const isDark = resolvedTheme === "dark";
  const next = isDark ? "light" : "dark";

  const change = () => setPreference(next);

  const onClick = () => {
    const btn = btnRef.current;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    const canTransition =
      typeof doc.startViewTransition === "function" && !reduce && btn !== null;

    if (!canTransition) {
      // Fallback: instant switch with a short cross-fade.
      const root = document.documentElement;
      root.classList.add("theme-fade");
      change();
      window.setTimeout(() => root.classList.remove("theme-fade"), 300);
      return;
    }

    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = doc.startViewTransition!(() => {
      flushSync(change);
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 650,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {});
  };

  return (
    <motion.button
      ref={btnRef}
      type="button"
      onClick={onClick}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      whileHover={reduce ? undefined : { rotate: 14, scale: 1.06 }}
      whileTap={reduce ? undefined : { scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className={`${base} transition-shadow hover:shadow-[var(--shadow-glow)] hover:text-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${className}`}
    >
      <SunMoonIcon isDark={isDark} reduce={reduce} />
    </motion.button>
  );
}
