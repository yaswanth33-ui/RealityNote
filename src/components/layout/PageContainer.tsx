
import { cn } from "@/lib/utils";
import React from "react";
import { TransitionEffect } from "../ui/TransitionEffect";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <TransitionEffect type="fade">
      <main className={cn(
        "pt-8 pb-24 px-4 max-w-5xl mx-auto min-h-screen",
        className
      )}>
        {children}
      </main>
    </TransitionEffect>
  );
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <TransitionEffect type="slide">
      <h1 className="text-3xl font-semibold tracking-tight mb-8 text-balance">
        {children}
      </h1>
    </TransitionEffect>
  );
}

export function PageSection({ 
  children, 
  title,
  className 
}: { 
  children: React.ReactNode; 
  title?: string;
  className?: string;
}) {
  return (
    <section className={cn("mb-8", className)}>
      {title && (
        <h2 className="text-lg font-medium text-reality-800 dark:text-reality-200 mb-4">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
