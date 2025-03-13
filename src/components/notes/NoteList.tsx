
import { useState } from "react";
import { NoteWithId } from "@/types/note";
import { NoteCard } from "./NoteCard";
import { NoteEditor } from "./NoteEditor";
import { TransitionEffect } from "../ui/TransitionEffect";

interface NoteListProps {
  notes: NoteWithId[];
  onSave: (note: any) => Promise<NoteWithId>;
  onDelete: (id: string) => Promise<void>;
}

export function NoteList({ notes, onSave, onDelete }: NoteListProps) {
  const [selectedNote, setSelectedNote] = useState<NoteWithId | null>(null);
  
  const handleSave = async (note: any) => {
    const savedNote = await onSave(note);
    setSelectedNote(null);
    return savedNote;
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note, index) => (
          <NoteCard 
            key={note.id} 
            note={note} 
            index={index}
            onClick={() => setSelectedNote(note)}
          />
        ))}
      </div>
      
      {selectedNote && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <NoteEditor 
            note={selectedNote} 
            onClose={() => setSelectedNote(null)} 
            onSave={handleSave}
            onDelete={onDelete}
          />
        </div>
      )}
    </>
  );
}
