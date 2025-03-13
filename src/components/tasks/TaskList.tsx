
import { Plus } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "../ui/GlassMorphism";
import { Task, TaskItem } from "./TaskItem";
import { Button } from "@/components/ui/button";

interface TaskListProps {
  tasks: Task[];
  onTaskChange: (updatedTask: Task) => void;
  onAddTask?: () => void;
  title?: string;
}

export function TaskList({ tasks, onTaskChange, onAddTask, title }: TaskListProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });
  
  const filters = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        {title && <h3 className="font-medium">{title}</h3>}
        
        <div className="flex">
          <div className="flex bg-reality-100/50 dark:bg-reality-800/50 rounded-lg p-0.5 mr-2">
            {filters.map((f) => (
              <button
                key={f.value}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === f.value 
                    ? "bg-white dark:bg-reality-700 text-reality-950 dark:text-white shadow-sm" 
                    : "text-reality-600 hover:text-reality-900 dark:text-reality-400 dark:hover:text-white"
                }`}
                onClick={() => setFilter(f.value as any)}
              >
                {f.label}
              </button>
            ))}
          </div>
          
          {onAddTask && (
            <Button
              size="sm" 
              onClick={onAddTask}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>Add</span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="divide-y divide-reality-100 dark:divide-reality-800">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onChange={onTaskChange}
            />
          ))
        ) : (
          <div className="py-4 text-center text-reality-500 text-sm">
            No tasks to display
          </div>
        )}
      </div>
    </GlassCard>
  );
}
