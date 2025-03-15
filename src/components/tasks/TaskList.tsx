import { Plus, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "../ui/GlassMorphism";
import { Task, TaskItem } from "./TaskItem";
import { Button } from "@/components/ui/button";

interface TaskListProps {
  tasks: Task[];
  onTaskChange: (updatedTask: Task) => void;
  onAddTask?: () => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  title?: string;
}

export function TaskList({ tasks, onTaskChange, onAddTask, onDelete, onEdit, title }: TaskListProps) {
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
            <div
              key={task.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-reality-50 dark:hover:bg-reality-800/50 transition-colors group"
            >
              <div className="flex items-center flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onTaskChange({ ...task, completed: !task.completed })}
                  className="mr-3"
                />
                <span className={task.completed ? "line-through text-reality-400" : ""}>
                  {task.title}
                </span>
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  task.priority === 'high' 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                {!task.completed && (
                  <button
                    onClick={() => onEdit(task)}
                    className="p-1 rounded-full hover:bg-reality-100 dark:hover:bg-reality-800 transition-all"
                    aria-label="Edit task"
                  >
                    <Edit2 className="w-4 h-4 text-reality-500 hover:text-reality-700" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-1 rounded-full hover:bg-reality-100 dark:hover:bg-reality-800 transition-all"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-4 h-4 text-reality-500 hover:text-reality-700" />
                </button>
              </div>
            </div>
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
