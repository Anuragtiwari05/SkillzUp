"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Server renders the FINAL value (so no-JS / SEO / first paint is correct).
 * When the stat scrolls into view it fades in and counts up from 0 to that value.
 */
export default function StatCounter({
  value,
  suffix = "",
  decimals = 0,
  label,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const [armed, setArmed] = useState(false);

  // Only after hydration do we allow the 0 -> value animation (SSR stays at the final value).
  useEffect(() => setArmed(true), []);

  useEffect(() => {
    if (!inView || !armed || reduce) return;
    setDisplay(0);
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    // Safety net: if frames never tick (background tab, throttled), still land on the final value.
    const settle = window.setTimeout(() => setDisplay(value), 1900);
    return () => {
      controls.stop();
      window.clearTimeout(settle);
      setDisplay(value);
    };
  }, [inView, armed, reduce, value]);

  const text = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={armed && !inView ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center lg:text-left"
    >
      <div className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground tabular-nums">
        {text}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground font-medium mt-1">{label}</div>
    </motion.div>
  );
}
