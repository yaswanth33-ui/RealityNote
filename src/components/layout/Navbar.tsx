import { cn } from "@/lib/utils";
import { Book, Clock, FileText, Home, List, UserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { GlassPanel } from "../ui/GlassMorphism";
import { TransitionEffect } from "../ui/TransitionEffect";

const navItems = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Notes", icon: FileText, path: "/notes" },
  { name: "Tasks", icon: List, path: "/tasks" },
  { name: "Focus", icon: Clock, path: "/focus" },
  { name: "Profile", icon: UserRound, path: "/profile" },
];

export function Navbar() {
  const location = useLocation();

  return (
    <TransitionEffect type="fade">
      <GlassPanel 
        intensity="medium" 
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-2 py-1.5 flex items-center justify-between space-x-2 max-w-md mx-auto w-[calc(100%-2rem)] rounded-2xl"
      >
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-xl transition-all duration-200 px-3 py-2 group flex-1 text-center min-w-[64px] gap-1",
                isActive 
                  ? "bg-reality-100 text-reality-950 dark:bg-reality-800 dark:text-white shadow-sm" 
                  : "text-reality-600 hover:text-reality-950 dark:text-reality-400 dark:hover:text-white hover:bg-reality-100/50 dark:hover:bg-reality-800/50"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-[10px] truncate">
                {item.name}
              </span>
            </Link>
          );
        })}
      </GlassPanel>
    </TransitionEffect>
  );
}
