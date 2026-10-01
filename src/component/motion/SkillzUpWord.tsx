"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

const WORD = "SkillzUp".split("");

/* ---------- hero: letters drop + 3D flip, tied to scroll progress (reversible) ---------- */
function HeroLetter({ ch, i, progress }: { ch: string; i: number; progress: MotionValue<number> }) {
  const start = i * 0.045;
  const end = 0.55 + i * 0.045;
  const y = useTransform(progress, [start, end], ["0%", "38%"]);
  const rotateX = useTransform(progress, [start, end], [0, i % 2 ? 180 : -180]);
  const opacity = useTransform(progress, [start + 0.3, end + 0.2], [1, 0.12]);
  return (
    <motion.span
      style={{ y, rotateX, opacity, display: "inline-block", transformOrigin: "50% 60%" }}
      className={i >= 6 ? "text-link" : undefined}
    >
      {ch}
    </motion.span>
  );
}

function HeroWord({ className }: { className: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 50%", "end start"] });
  return (
    <span ref={ref} aria-label="SkillzUp" className={`inline-block [perspective:900px] ${className}`}>
      <span aria-hidden className="inline-block">
        {WORD.map((ch, i) =>
          reduce ? (
            <span key={i} className={i >= 6 ? "text-link" : undefined}>
              {ch}
            </span>
          ) : (
            <HeroLetter key={i} ch={ch} i={i} progress={scrollYProgress} />
          )
        )}
      </span>
    </span>
  );
}

/* ---------- tilt: letters tilt/rotate slightly as the word scrolls past ---------- */
function TiltLetter({ ch, i, progress }: { ch: string; i: number; progress: MotionValue<number> }) {
  const dir = i % 2 ? 1 : -1;
  const rotate = useTransform(progress, [0, 0.5, 1], [dir * 5, 0, dir * -5]);
  const rotateX = useTransform(progress, [0, 0.5, 1], [dir * 18, 0, dir * -18]);
  const y = useTransform(progress, [0, 0.5, 1], [dir * 2, 0, dir * -2]);
  return <motion.span style={{ rotate, rotateX, y, display: "inline-block" }}>{ch}</motion.span>;
}

function TiltWord({ className }: { className: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <span ref={ref} aria-label="SkillzUp" className={`inline-block [perspective:600px] ${className}`}>
      <span aria-hidden className="inline-block">
        {WORD.map((ch, i) =>
          reduce ? (
            <span key={i}>{ch}</span>
          ) : (
            <TiltLetter key={i} ch={ch} i={i} progress={scrollYProgress} />
          )
        )}
      </span>
    </span>
  );
}

/* ---------- nav: quick letter-by-letter flip whenever the page scrolls ---------- */
function NavWord({ className }: { className: string }) {
  const [scope, animate] = useAnimate();
  const reduce = useReducedMotion();
  const busy = useRef(false);
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    lastY.current = window.scrollY;
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (reduce || busy.current) return;
    if (Math.abs(y - lastY.current) < 120) return;
    lastY.current = y;
    busy.current = true;
    animate(
      "span.sz-l",
      { rotateX: [0, 360] },
      { duration: 0.55, delay: (i: number) => i * 0.045, ease: "easeInOut" }
    ).then(() => {
      busy.current = false;
    });
  });

  return (
    <span ref={scope} aria-label="SkillzUp" className={`inline-block [perspective:500px] ${className}`}>
      <span aria-hidden className="inline-block">
        {WORD.map((ch, i) => (
          <span key={i} className="sz-l inline-block">
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function SkillzUpWord({
  variant = "tilt",
  className = "",
}: {
  variant?: "hero" | "tilt" | "nav";
  className?: string;
}) {
  if (variant === "hero") return <HeroWord className={className} />;
  if (variant === "nav") return <NavWord className={className} />;
  return <TiltWord className={className} />;
}
