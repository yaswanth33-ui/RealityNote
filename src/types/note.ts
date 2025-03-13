
export interface NoteData {
  id?: string;
  title: string;
  content: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface NoteWithId extends NoteData {
  id: string;
}

// Adding this type for the Index page
export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  date: string;
}
