"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Global motion settings: honours prefers-reduced-motion for every framer-motion animation. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}
