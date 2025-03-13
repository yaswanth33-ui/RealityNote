
import { cn } from "@/lib/utils";
import React from "react";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "low" | "medium" | "high";
  className?: string;
  children: React.ReactNode;
}

export function GlassPanel({
  intensity = "medium",
  className,
  children,
  ...props
}: GlassPanelProps) {
  const intensityClasses = {
    low: "bg-white/50 dark:bg-reality-950/50 backdrop-blur-md shadow-subtle",
    medium: "bg-white/70 dark:bg-reality-950/70 backdrop-blur-xl shadow-glass",
    high: "bg-white/80 dark:bg-reality-950/80 backdrop-blur-2xl shadow-glass-lg",
  };

  return (
    <div
      className={cn(
        "border border-white/20 dark:border-reality-800/30 rounded-xl",
        intensityClasses[intensity],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassCard({
  intensity = "medium",
  className,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <GlassPanel
      intensity={intensity}
      className={cn("p-6", className)}
      {...props}
    >
      {children}
    </GlassPanel>
  );
}
