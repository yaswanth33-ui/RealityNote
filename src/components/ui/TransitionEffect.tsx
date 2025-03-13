
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface TransitionEffectProps {
  children: React.ReactNode;
  className?: string;
  type?: "fade" | "slide" | "scale";
  show?: boolean;
  delay?: number;
}

export function TransitionEffect({
  children,
  className,
  type = "fade",
  show = true,
  delay = 0,
}: TransitionEffectProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const animations = {
    fade: show ? "animate-fade-in" : "animate-fade-out",
    slide: show ? "animate-slide-in" : "animate-slide-out",
    scale: show ? "animate-scale-in" : "animate-fade-out",
  };

  const delayStyle = delay ? { animationDelay: `${delay}ms` } : {};

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "animate-once",
        animations[type],
        className
      )}
      style={delayStyle}
    >
      {children}
    </div>
  );
}
