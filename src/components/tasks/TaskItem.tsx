
import { cn } from "@/lib/utils";
import { Check, Clock } from "lucide-react";
import { useState } from "react";
import { TransitionEffect } from "../ui/TransitionEffect";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

interface TaskItemProps {
  task: Task;
  onChange: (task: Task) => void;
  className?: string;
}

export function TaskItem({ task, onChange, className }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleToggle = () => {
    onChange({
      ...task,
      completed: !task.completed,
    });
  };
  
  const priorityColors = {
    low: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    medium: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    high: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  };
  
  return (
    <TransitionEffect type="fade" className="w-full">
      <div
        className={cn(
          "group flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-reality-100/50 dark:hover:bg-reality-800/30",
          task.completed && "opacity-70",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={handleToggle}
          className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center border transition-colors mr-3 flex-shrink-0",
            task.completed
              ? "bg-reality-950 border-reality-950 dark:bg-white dark:border-white"
              : "border-reality-300 dark:border-reality-700 group-hover:border-reality-400 dark:group-hover:border-reality-600"
          )}
        >
          {task.completed && <Check className="w-3 h-3 text-white dark:text-reality-950" />}
        </button>
        
        <div className="flex-grow">
          <div className="flex items-center">
            <span
              className={cn(
                "font-medium transition-all",
                task.completed && "line-through text-reality-500"
              )}
            >
              {task.title}
            </span>
          </div>
          
          {task.dueDate && (
            <div className="flex items-center mt-1 text-xs text-reality-500">
              <Clock className="w-3 h-3 mr-1" />
              <span>{task.dueDate}</span>
            </div>
          )}
        </div>
        
        {task.priority && (
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              priorityColors[task.priority]
            )}
          >
            {task.priority}
          </span>
        )}
      </div>
    </TransitionEffect>
  );
}
