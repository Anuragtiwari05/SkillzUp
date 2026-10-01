"use client";

import { useId, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useVelocity,
} from "framer-motion";

/** Circular text badge that spins continuously and speeds up with scroll velocity. */
export default function CircularBadge({
  text = "SKILLZUP • LEARN • BUILD • GROW • ",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const rotate = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const last = useRef<number | null>(null);
  const id = `sz-badge-${useId().replace(/:/g, "")}`;

  useAnimationFrame((t) => {
    if (reduce) return;
    const dt = last.current === null ? 16 : t - last.current;
    last.current = t;
    const boost = Math.min(Math.abs(velocity.get()) / 20, 400); // extra deg/s from scroll speed
    rotate.set((rotate.get() + ((24 + boost) * dt) / 1000) % 360);
  });

  return (
    <div className={`relative h-28 w-28 sm:h-36 sm:w-36 ${className}`} aria-hidden>
      <div className="absolute inset-0 rounded-full bg-primary shadow-[var(--shadow-card)]" />
      <motion.svg viewBox="0 0 200 200" style={{ rotate }} className="absolute inset-0 h-full w-full">
        <defs>
          <path id={id} d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
        </defs>
        <text
          fill="var(--primary-foreground)"
          fontSize="19"
          fontWeight="800"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <textPath href={`#${id}`} textLength="470" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center text-primary-foreground">
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 sm:h-9 sm:w-9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </div>
    </div>
  );
}
