"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";
import SkillzUpWord from "./SkillzUpWord";

/** Heading that reveals word-by-word through a mask when it enters the viewport.
 *  Any "SkillzUp" in the text gets the tilting-letters treatment. */
export default function RevealHeading({
  as = "h2",
  children,
  className = "",
  delay = 0,
}: {
  as?: ElementType;
  children: string;
  className?: string;
  delay?: number;
}) {
  const Tag = as as ElementType;
  const words = children.split(" ");
  return (
    <Tag className={className} aria-label={children}>
      <span aria-hidden className="inline">
        {words.map((w, i) => {
          const isBrand = w.replace(/[^A-Za-z]/g, "") === "SkillzUp";
          return (
            <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                {isBrand ? <SkillzUpWord variant="tilt" /> : w}
                {isBrand ? w.replace("SkillzUp", "") : null}
                {i < words.length - 1 ? " " : ""}
              </motion.span>
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
