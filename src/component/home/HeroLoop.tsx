"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, GraduationCap } from "lucide-react";

export default function HeroLoop() {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square flex items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-full bg-primary-100"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-16 h-16 sm:w-20 sm:h-20 bg-surface rounded-3xl shadow-[var(--shadow-card)] flex items-center justify-center"
        animate={{ y: [0, -14, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{ top: "12%", left: "14%" }}
      >
        <BookOpen className="w-7 h-7 sm:w-9 sm:h-9 text-primary-600" />
      </motion.div>

      <motion.div
        className="absolute w-14 h-14 sm:w-16 sm:h-16 bg-accent-500 rounded-2xl shadow-[var(--shadow-card)] flex items-center justify-center"
        animate={{ y: [0, 14, 0], rotate: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut", delay: 0.4 }}
        style={{ bottom: "16%", right: "12%" }}
      >
        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </motion.div>

      <motion.div
        className="relative w-32 h-32 sm:w-40 sm:h-40 bg-surface rounded-full shadow-[var(--shadow-card)] flex items-center justify-center z-10"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        <GraduationCap className="w-14 h-14 sm:w-16 sm:h-16 text-primary-600" />
      </motion.div>
    </div>
  );
}
