
import { cn } from "@/lib/utils";
import { ArrowUpRight, Clock, Tag } from "lucide-react";
import { GlassCard } from "../ui/GlassMorphism";
import { TransitionEffect } from "../ui/TransitionEffect";
import { NoteWithId } from "@/types/note";
import { formatDistanceToNow } from "date-fns";

interface NoteCardProps {
  note: NoteWithId;
  index?: number;
  onClick?: () => void;
  className?: string;
}

export function NoteCard({ note, index = 0, onClick, className }: NoteCardProps) {
  // Format the date to a relative time (e.g., "2 days ago")
  const formattedDate = note.updated_at
    ? formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })
    : "Unknown date";

  return (
    <TransitionEffect 
      type="scale" 
      delay={index * 50}
      className={cn("h-full", className)}
    >
      <GlassCard 
        className={cn(
          "cursor-pointer h-full flex flex-col transition-all duration-200 hover:shadow-glass-lg group",
          className
        )} 
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium line-clamp-1">{note.title}</h3>
          <ArrowUpRight className="w-4 h-4 text-reality-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <p className="text-reality-600 dark:text-reality-400 text-sm line-clamp-3 mb-4 flex-grow">
          {note.content}
        </p>
        
        <div className="flex items-center justify-between text-xs text-reality-500 mt-auto pt-2 border-t border-reality-100 dark:border-reality-800">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{formattedDate}</span>
          </div>
          
          {note.tags && note.tags.length > 0 && (
            <div className="flex items-center">
              <Tag className="w-3 h-3 mr-1" />
              <span>{note.tags.slice(0, 2).join(", ")}</span>
              {note.tags.length > 2 && <span>...</span>}
            </div>
          )}
        </div>
      </GlassCard>
    </TransitionEffect>
  );
}
