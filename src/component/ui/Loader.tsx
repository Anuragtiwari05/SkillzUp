"use client";

import { motion } from "framer-motion";

export default function Loader({
  label,
  size = "md",
}: {
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dimensions = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <motion.span
        className={`${dimensions} rounded-full border-[3px] border-primary-200 border-t-primary-600`}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
      {label && (
        <p className="text-sm font-semibold text-neutral-600">{label}</p>
      )}
    </div>
  );
}
