
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { NoteData, NoteWithId } from '@/types/note';
import { toast } from 'sonner';

export function useNotes() {
  const [notes, setNotes] = useState<NoteWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      setNotes(data as NoteWithId[]);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch notes'));
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = async (note: NoteData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([{ 
          ...note, 
          user_id: user.id,
          updated_at: new Date().toISOString() 
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setNotes(prev => [data as NoteWithId, ...prev]);
      toast.success('Note created successfully');
      return data as NoteWithId;
    } catch (err) {
      console.error('Error adding note:', err);
      toast.error('Failed to create note');
      throw err;
    }
  };

  const updateNote = async (id: string, updates: Partial<NoteData>) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setNotes(prev => prev.map(note => note.id === id ? { ...note, ...data } : note));
      toast.success('Note updated successfully');
      return data as NoteWithId;
    } catch (err) {
      console.error('Error updating note:', err);
      toast.error('Failed to update note');
      throw err;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setNotes(prev => prev.filter(note => note.id !== id));
      toast.success('Note deleted successfully');
    } catch (err) {
      console.error('Error deleting note:', err);
      toast.error('Failed to delete note');
      throw err;
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote
  };
}
