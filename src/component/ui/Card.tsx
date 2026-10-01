"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  hover?: boolean;
  /** Tilt toward the cursor (fine pointers only). Defaults to on whenever `hover` is. */
  tilt?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = true, tilt, className = "", children, onPointerMove, onPointerLeave, style, ...props }, ref) => {
    const reduce = useReducedMotion();
    const [fine, setFine] = useState(false);
    const localRef = useRef<HTMLDivElement | null>(null);
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const sx = useSpring(px, { stiffness: 220, damping: 20 });
    const sy = useSpring(py, { stiffness: 220, damping: 20 });
    const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);
    const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);

    const doTilt = (tilt ?? hover) && fine && !reduce;

    useEffect(() => {
      setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    }, []);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    return (
      <motion.div
        ref={setRefs}
        whileHover={hover && !reduce ? { y: -6 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        onPointerMove={(e) => {
          onPointerMove?.(e);
          if (!doTilt || !localRef.current) return;
          const r = localRef.current.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={(e) => {
          onPointerLeave?.(e);
          px.set(0);
          py.set(0);
        }}
        style={{ ...(doTilt ? { rotateX, rotateY, transformPerspective: 900 } : {}), ...style }}
        className={`bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-card)] text-foreground ${
          hover ? "hover:border-link/40" : ""
        } ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export default Card;
