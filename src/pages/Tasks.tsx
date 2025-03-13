
import { useState } from "react";
import { PageContainer, PageSection, PageTitle } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/GlassMorphism";
import { TransitionEffect } from "@/components/ui/TransitionEffect";
import { Loader2, Plus, X } from "lucide-react";
import { TaskList } from "@/components/tasks/TaskList";
import { useTasks, Task } from "@/hooks/useTasks";

export default function Tasks() {
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTasks();
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  
  const handleTaskChange = (updatedTask: Task) => {
    updateTask(updatedTask.id, {
      title: updatedTask.title,
      completed: updatedTask.completed,
      priority: updatedTask.priority,
      due_date: updatedTask.due_date
    });
  };
  
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    addTask({
      title: newTaskTitle,
      completed: false,
      priority: newTaskPriority,
      due_date: "Today",
    });
    
    setNewTaskTitle("");
    setShowAddTask(false);
  };
  
  return (
    <PageContainer>
      <PageTitle>Tasks</PageTitle>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-reality-600" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Failed to load tasks</p>
          <Button onClick={() => window.location.reload()}>
            <span>Retry</span>
          </Button>
        </div>
      ) : (
        <>
          {showAddTask ? (
            <TransitionEffect type="scale" className="mb-6">
              <GlassPanel className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Add New Task</h3>
                  <button 
                    onClick={() => setShowAddTask(false)}
                    className="p-1 rounded-full hover:bg-reality-100 dark:hover:bg-reality-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full p-2 bg-white/50 dark:bg-reality-800/50 border border-reality-200 dark:border-reality-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-reality-300 dark:focus:ring-reality-600 transition-all"
                    autoFocus
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm text-reality-600 dark:text-reality-400 mb-2">
                    Priority
                  </label>
                  <div className="flex space-x-2">
                    {(["low", "medium", "high"] as const).map((priority) => (
                      <button
                        key={priority}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          newTaskPriority === priority
                            ? "bg-reality-100 dark:bg-reality-800 text-reality-900 dark:text-white"
                            : "text-reality-600 dark:text-reality-400 hover:bg-reality-50 dark:hover:bg-reality-800/50"
                        }`}
                        onClick={() => setNewTaskPriority(priority)}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddTask(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddTask}
                    disabled={!newTaskTitle.trim()}
                  >
                    Add Task
                  </Button>
                </div>
              </GlassPanel>
            </TransitionEffect>
          ) : (
            <div className="mb-6">
              <Button onClick={() => setShowAddTask(true)}>
                <Plus className="w-4 h-4 mr-2" />
                <span>Add Task</span>
              </Button>
            </div>
          )}
          
          <PageSection>
            {tasks.length > 0 ? (
              <TaskList 
                tasks={tasks} 
                onTaskChange={handleTaskChange}
                title="All Tasks"
              />
            ) : (
              <TransitionEffect type="fade">
                <div className="text-center py-12">
                  <p className="text-reality-500 mb-4">No tasks found</p>
                  <Button onClick={() => setShowAddTask(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    <span>Create your first task</span>
                  </Button>
                </div>
              </TransitionEffect>
            )}
          </PageSection>
        </>
      )}
    </PageContainer>
  );
}
