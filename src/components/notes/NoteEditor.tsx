
import { cn } from "@/lib/utils";
import { X, Trash2, Tag as TagIcon } from "lucide-react";
import { useState } from "react";
import { GlassPanel } from "../ui/GlassMorphism";
import { TransitionEffect } from "../ui/TransitionEffect";
import { Button } from "@/components/ui/button";
import { NoteWithId, NoteData } from "@/types/note";
import { toast } from "sonner";

interface NoteEditorProps {
  note?: NoteWithId;
  onClose: () => void;
  onSave: (note: NoteData) => Promise<NoteWithId>;
  onDelete?: (id: string) => Promise<void>;
  className?: string;
}

export function NoteEditor({ note, onClose, onSave, onDelete, className }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    
    try {
      setSaving(true);
      const saveData: NoteData = {
        title,
        content,
        tags,
      };
      
      // Only add id if we're editing an existing note
      if (note?.id) {
        saveData.id = note.id;
      }
      
      await onSave(saveData);
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!note?.id || !onDelete) return;
    
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        setDeleting(true);
        await onDelete(note.id);
        onClose();
      } catch (error) {
        console.error("Error deleting note:", error);
      } finally {
        setDeleting(false);
      }
    }
  };
  
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  return (
    <TransitionEffect type="scale" className={cn("w-full max-w-3xl max-h-[80vh]", className)}>
      <GlassPanel intensity="high" className="w-full overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-reality-100 dark:border-reality-800">
          <h2 className="text-xl font-medium">
            {note ? "Edit Note" : "New Note"}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-reality-100 dark:hover:bg-reality-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-grow">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 text-lg font-medium bg-transparent border-b border-reality-100 dark:border-reality-800 focus:outline-none focus:border-reality-300 dark:focus:border-reality-700 transition-colors"
            />
          </div>
          
          <div>
            <textarea
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[300px] p-2 bg-transparent focus:outline-none resize-none"
            />
          </div>
          
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <div key={tag} className="bg-reality-100 dark:bg-reality-800 px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                  <span>{tag}</span>
                  <button onClick={() => removeTag(tag)} className="hover:text-reality-500">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex items-center">
              <TagIcon className="w-4 h-4 mr-2 text-reality-400" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add a tag..."
                className="flex-grow p-2 bg-transparent focus:outline-none text-sm"
              />
              <Button variant="ghost" size="sm" onClick={addTag}>Add</Button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-reality-100 dark:border-reality-800 flex justify-between">
          {note && onDelete && (
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          )}
          <div className="ml-auto flex space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </GlassPanel>
    </TransitionEffect>
  );
}
