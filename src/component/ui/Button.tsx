"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 shadow-[0_10px_24px_-8px_rgba(47,111,237,0.55)]",
  secondary:
    "bg-accent-500 text-white hover:bg-accent-600 shadow-[0_10px_24px_-8px_rgba(249,115,22,0.5)]",
  outline:
    "bg-transparent text-neutral-900 border-2 border-neutral-200 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-800",
};

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variant;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.045 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold text-sm sm:text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
