import { motion } from "motion/react";
import type { MouseEventHandler, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const sizes = {
  xs: "h-7 px-2 text-xs",
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-13 px-8 text-lg",
  xl: "h-15 px-10 text-xl",
};

type Size = keyof typeof sizes;

type Props = {
  className?: string;
  size?: Size;
  children?: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler;
};

const baseClasses =
  "inline-flex items-center justify-center squircle font-bold text-lg bg-highlight text-white shadow disabled:cursor-wait shrink-0";

export default function Button({
  className = "",
  size = "md",
  children,
  disabled,
  type,
  onClick,
}: Props) {
  const classes = twMerge(`${baseClasses} ${sizes[size]}`, className);

  return (
    <motion.button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      type={type}
      initial={{ y: -10, opacity: 0, scale: 1 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -10, opacity: 0, scale: 1 }}
      whileHover={!disabled ? { scale: 1.05 } : { scale: 1 }}
      whileTap={!disabled ? { scale: 0.95 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      {children}
    </motion.button>
  );
}
