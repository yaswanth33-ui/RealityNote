
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  user_id?: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setTasks(data as Task[]);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (task: Omit<Task, 'id' | 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([{ 
          ...task, 
          user_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setTasks(prev => [data as Task, ...prev]);
      toast.success('Task created successfully');
      return data as Task;
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error('Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'user_id'>>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setTasks(prev => prev.map(task => task.id === id ? { ...task, ...data } : task));
      toast.success('Task updated successfully');
      return data as Task;
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask
  };
}
