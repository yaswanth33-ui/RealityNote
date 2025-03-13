
import { GlassCard } from "@/components/ui/GlassMorphism";
import { PageContainer, PageSection } from "@/components/layout/PageContainer";
import { TransitionEffect } from "@/components/ui/TransitionEffect";
import { ArrowRight, FileText, List, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { TaskList } from "@/components/tasks/TaskList";
import { NoteList } from "@/components/notes/NoteList";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { NoteWithId } from "@/types/note";
import { Task } from "@/hooks/useTasks";
import { toast } from "sonner";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [recentNotes, setRecentNotes] = useState<NoteWithId[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      
      if (session) {
        await fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoggedIn(!!session);
      
      if (session) {
        await fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Fetch recent notes
      const { data: notes, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(3);
        
      if (notesError) throw notesError;
      
      // Fetch upcoming tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (tasksError) throw tasksError;
      
      setRecentNotes(notes as NoteWithId[]);
      setUpcomingTasks(tasks as Task[]);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load your data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskChange = async (task: Task) => {
    try {
      await supabase
        .from('tasks')
        .update({ 
          completed: task.completed,
          updated_at: new Date().toISOString() 
        })
        .eq('id', task.id);
        
      setUpcomingTasks(prev => 
        prev.map(t => t.id === task.id ? { ...t, completed: task.completed } : t)
      );
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  // Mock functions for NoteList to satisfy TypeScript
  const mockSaveNote = async (note: any) => {
    console.log("Save note:", note);
    return note as any;
  };

  const mockDeleteNote = async (id: string) => {
    console.log("Delete note:", id);
  };

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <TransitionEffect type="fade">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-balance">
              RealityNote
            </h1>
            <p className="text-reality-600 dark:text-reality-400 text-lg md:text-xl max-w-2xl text-balance">
              A modern hub for thought & action. Seamlessly connect your ideas, tasks, and focus.
            </p>
            
            {isLoggedIn === false && (
              <div className="mt-6">
                <Button asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </TransitionEffect>

        <PageSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <TransitionEffect type="slide" delay={100}>
              <Link to="/notes">
                <GlassCard className="h-full cursor-pointer hover:shadow-glass-lg transition-all duration-200 flex flex-col">
                  <div className="flex items-center mb-3">
                    <span className="bg-reality-100 dark:bg-reality-800 p-2 rounded-lg mr-3">
                      <FileText className="w-5 h-5 text-reality-600 dark:text-reality-400" />
                    </span>
                    <h3 className="font-medium">Notes</h3>
                  </div>
                  <p className="text-sm text-reality-600 dark:text-reality-400 mb-4">
                    Capture and organize your thoughts, ideas and meeting notes.
                  </p>
                  <div className="flex items-center text-sm text-reality-800 dark:text-reality-200 mt-auto">
                    <span>View notes</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </GlassCard>
              </Link>
            </TransitionEffect>
            
            <TransitionEffect type="slide" delay={200}>
              <Link to="/tasks">
                <GlassCard className="h-full cursor-pointer hover:shadow-glass-lg transition-all duration-200 flex flex-col">
                  <div className="flex items-center mb-3">
                    <span className="bg-reality-100 dark:bg-reality-800 p-2 rounded-lg mr-3">
                      <List className="w-5 h-5 text-reality-600 dark:text-reality-400" />
                    </span>
                    <h3 className="font-medium">Tasks</h3>
                  </div>
                  <p className="text-sm text-reality-600 dark:text-reality-400 mb-4">
                    Manage your to-dos, set priorities and track your progress.
                  </p>
                  <div className="flex items-center text-sm text-reality-800 dark:text-reality-200 mt-auto">
                    <span>View tasks</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </GlassCard>
              </Link>
            </TransitionEffect>
          </div>
          
          <TransitionEffect type="slide" delay={300}>
            <Link to="/focus">
              <GlassCard className="cursor-pointer hover:shadow-glass-lg transition-all duration-200">
                <div className="flex items-center mb-3">
                  <span className="bg-reality-100 dark:bg-reality-800 p-2 rounded-lg mr-3">
                    <Zap className="w-5 h-5 text-reality-600 dark:text-reality-400" />
                  </span>
                  <h3 className="font-medium">Focus Mode</h3>
                </div>
                <p className="text-sm text-reality-600 dark:text-reality-400 mb-4">
                  Boost productivity with distraction-free writing and Pomodoro timing.
                </p>
                <div className="flex items-center text-sm text-reality-800 dark:text-reality-200">
                  <span>Start focus session</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </GlassCard>
            </Link>
          </TransitionEffect>
        </PageSection>
        
        {isLoggedIn && !isLoading && (
          <>
            <PageSection title="Recent Notes">
              {recentNotes.length > 0 ? (
                <>
                  <NoteList 
                    notes={recentNotes} 
                    onSave={mockSaveNote} 
                    onDelete={mockDeleteNote}
                  />
                  <div className="mt-4 text-center">
                    <Button asChild variant="outline">
                      <Link to="/notes" className="flex items-center">
                        <span>View all notes</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-reality-500 mb-4">No notes yet</p>
                  <Button asChild>
                    <Link to="/notes">Create your first note</Link>
                  </Button>
                </div>
              )}
            </PageSection>
            
            <PageSection title="Upcoming Tasks">
              {upcomingTasks.length > 0 ? (
                <>
                  <TaskList 
                    tasks={upcomingTasks} 
                    onTaskChange={handleTaskChange}
                  />
                  <div className="mt-4 text-center">
                    <Button asChild variant="outline">
                      <Link to="/tasks" className="flex items-center">
                        <span>View all tasks</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-reality-500 mb-4">No tasks yet</p>
                  <Button asChild>
                    <Link to="/tasks">Create your first task</Link>
                  </Button>
                </div>
              )}
            </PageSection>
          </>
        )}
      </div>
    </PageContainer>
  );
}
