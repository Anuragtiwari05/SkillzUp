"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote } from "lucide-react";

// Placeholder copy — swap in real learner quotes before shipping.
const TESTIMONIALS = [
  {
    quote:
      "SkillzUp turned a vague goal of 'learn React' into an actual week-by-week plan I could follow. The AI assistant filled in the gaps whenever I got stuck.",
    name: "Priya S.",
    role: "Self-taught frontend developer",
  },
  {
    quote:
      "The roadmap library gave my son a clear path into backend development. He went from bookmarking random tutorials to following a real curriculum.",
    name: "Marcus T.",
    role: "Parent of a learner",
  },
  {
    quote:
      "As someone mentoring junior devs, I point people to SkillzUp's roadmaps constantly — it's the fastest way to give someone a starting structure.",
    name: "Dana R.",
    role: "Engineering mentor",
  },
];

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(t);
  }, [paused]);

  const current = TESTIMONIALS[index];

  return (
    <div
      className="max-w-2xl mx-auto text-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Quote className="w-8 h-8 text-primary-500 mx-auto mb-6" />

      <div className="min-h-[160px] sm:min-h-[120px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-lg sm:text-xl text-neutral-800 font-medium leading-relaxed mb-4">
              &ldquo;{current.quote}&rdquo;
            </p>
            <p className="font-heading font-bold text-neutral-900">{current.name}</p>
            <p className="text-sm text-neutral-600">{current.role}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-primary-600" : "w-2 bg-neutral-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
