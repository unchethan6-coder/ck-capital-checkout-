"use client";
import { cn } from "@/lib/utils";

interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "gold" | "outline" | "ghost";
  children: React.ReactNode;
}

export function GoldButton({
  size = "md",
  variant = "gold",
  className,
  children,
  ...props
}: GoldButtonProps) {
  const sizes = {
    sm: "px-3.5 py-1.5 text-xs font-bold",
    md: "px-5 py-2.5 text-sm font-extrabold",
    lg: "px-7 py-3.5 text-base font-black",
  };

  const variants = {
    gold: "brand-gradient-btn text-[#1A1030] font-bold hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-md hover:shadow-amber-400/20",
    outline: "text-foreground border border-white/20 bg-white/[0.04] hover:border-[#894CEF] hover:text-[#A98BFF] hover:bg-white/[0.08] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    ghost: "text-foreground/85 hover:text-white hover:bg-white/10 active:scale-[0.98]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 ease-out cursor-pointer",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
