
import { useState } from "react";
import { NoteWithId } from "@/types/note";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { NoteList } from "@/components/notes/NoteList";
import { Button } from "@/components/ui/button";
import { PageContainer, PageTitle } from "@/components/layout/PageContainer";
import { Loader2, Plus, Search } from "lucide-react";
import { TransitionEffect } from "@/components/ui/TransitionEffect";
import { useNotes } from "@/hooks/useNotes";

export default function Notes() {
  const { notes, loading, error, addNote, updateNote, deleteNote } = useNotes();
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });
  
  const handleSaveNote = async (note: any) => {
    if (note.id) {
      // Update existing note
      const updatedNote = await updateNote(note.id, note);
      setShowEditor(false);
      return updatedNote;
    } else {
      // Add new note
      const newNote = await addNote(note);
      setShowEditor(false);
      return newNote;
    }
  };
  
  return (
    <PageContainer>
      <PageTitle>Notes</PageTitle>
      
      <div className="flex justify-between items-center mb-6">
        <TransitionEffect type="slide" className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-reality-500" />
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-white/50 dark:bg-reality-800/50 backdrop-blur-sm border border-reality-200 dark:border-reality-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-reality-300 dark:focus:ring-reality-600 transition-all"
          />
        </TransitionEffect>
        
        <TransitionEffect type="slide" delay={100}>
          <Button onClick={() => setShowEditor(true)}>
            <Plus className="w-4 h-4 mr-2" />
            <span>New Note</span>
          </Button>
        </TransitionEffect>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-reality-500" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Failed to load notes</p>
          <Button onClick={() => window.location.reload()}>
            <span>Retry</span>
          </Button>
        </div>
      ) : filteredNotes.length > 0 ? (
        <NoteList 
          notes={filteredNotes}
          onSave={handleSaveNote}
          onDelete={deleteNote}
        />
      ) : (
        <TransitionEffect type="fade">
          <div className="text-center py-12">
            <p className="text-reality-500 mb-4">No notes found</p>
            <Button onClick={() => setShowEditor(true)}>
              <Plus className="w-4 h-4 mr-2" />
              <span>Create your first note</span>
            </Button>
          </div>
        </TransitionEffect>
      )}
      
      {showEditor && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <NoteEditor 
            onClose={() => setShowEditor(false)} 
            onSave={handleSaveNote}
          />
        </div>
      )}
    </PageContainer>
  );
}
