import { useState, useEffect, useCallback, useRef } from "react";
import { PageContainer, PageTitle } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassPanel } from "@/components/ui/GlassMorphism";
import { TransitionEffect } from "@/components/ui/TransitionEffect";
import { Loader2, Pause, Play, RotateCcw, Timer, Zap, Save, Plus, List, Trash } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface WritingSession {
  id: string;
  content: string;
  title: string;
  created_at: string;
  updated_at: string;
  export_history?: string[];
  content_history?: {
    timestamp: string;
    content: string;
    title: string;
  }[];
}

interface PomodoroTechnique {
  name: string;
  description: string;
  workDuration: number;
  breakDuration: number;
  instructions: string[];
}

export default function Focus() {
  const [mode, setMode] = useState<"pomodoro" | "writing">("pomodoro");
  
  const [timer, setTimer] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  
  const [content, setContent] = useState("");
  const [currentWritingId, setCurrentWritingId] = useState<string | null>(null);
  const [title, setTitle] = useState("Untitled");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allSessions, setAllSessions] = useState<WritingSession[]>([]);
  const [showSessionsList, setShowSessionsList] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [activeTechnique, setActiveTechnique] = useState<PomodoroTechnique>({
    name: "Classic Pomodoro",
    description: "Traditional 25/5 format for maximum productivity",
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    instructions: [
      "Choose a task to focus on",
      "Set the timer for 25 minutes",
      "Work on the task until the timer rings",
      "Take a short 5-minute break",
      "After four pomodoros, take a longer break (15-30 minutes)",
      "Repeat to maintain productivity"
    ]
  });
  
  const pomodoroTechniques: PomodoroTechnique[] = [
    {
      name: "Classic Pomodoro",
      description: "Traditional 25/5 format for maximum productivity",
      workDuration: 25 * 60,
      breakDuration: 5 * 60,
      instructions: [
        "Choose a task to focus on",
        "Set the timer for 25 minutes",
        "Work on the task until the timer rings",
        "Take a short 5-minute break",
        "After four pomodoros, take a longer break (15-30 minutes)",
        "Repeat to maintain productivity"
      ]
    },
    {
      name: "Short Sessions",
      description: "Shorter 15/3 intervals for maintaining focus",
      workDuration: 15 * 60,
      breakDuration: 3 * 60,
      instructions: [
        "Select a specific task that needs attention",
        "Set the timer for 15 minutes of focused work",
        "Work without interruptions or distractions",
        "Take a quick 3-minute break to refresh",
        "Complete 6-8 cycles before taking a longer break",
        "Ideal for tasks requiring frequent context switching"
      ]
    },
    {
      name: "Extended Focus",
      description: "Longer 45/10 periods for deep work sessions",
      workDuration: 45 * 60,
      breakDuration: 10 * 60,
      instructions: [
        "Choose a complex task requiring deep thought",
        "Set the timer for 45 minutes of uninterrupted work",
        "Eliminate all distractions during the work period",
        "Take a substantial 10-minute break to recharge",
        "Complete 3-4 cycles in a day for optimal results",
        "Best for creative or analytical work requiring deep concentration"
      ]
    },
    {
      name: "52/17 Method",
      description: "Research-backed rhythm for optimal productivity",
      workDuration: 52 * 60,
      breakDuration: 17 * 60,
      instructions: [
        "Plan your 52-minute work session in advance",
        "Use a timer and focus completely on your work",
        "Avoid checking emails or messages during the work period",
        "Take a full 17-minute break away from your desk",
        "During breaks, walk, stretch, or engage in non-work activities",
        "This method is based on research of most productive workers' habits"
      ]
    },
    {
      name: "90/20 Deep Work",
      description: "Extended deep work with proper recovery time",
      workDuration: 90 * 60,
      breakDuration: 20 * 60,
      instructions: [
        "Schedule your 90-minute deep work session in advance",
        "Remove all potential interruptions from your environment",
        "Focus on a single complex task or project",
        "Work at your highest cognitive level for the full 90 minutes",
        "Take a proper 20-minute break to fully recover mental energy",
        "Limit to 2-3 sessions per day to maintain quality of thinking"
      ]
    },
    {
      name: "Ultradian Rhythm",
      description: "Works with your body's natural energy cycles",
      workDuration: 90 * 60,
      breakDuration: 20 * 60,
      instructions: [
        "Align work sessions with your natural energy peaks",
        "Focus intensely for 90 minutes following your body's ultradian rhythm",
        "Complete one full task or make significant progress on larger projects",
        "Take a 20-minute break to allow your brain to consolidate learning",
        "Use breaks for truly restful activities, not just different work",
        "Track your energy levels to find your optimal working windows"
      ]
    },
    {
      name: "Flowtime Technique",
      description: "Flexible timing based on your natural flow state",
      workDuration: 25 * 60, // Default starting point
      breakDuration: 5 * 60, // Default starting point
      instructions: [
        "Select your task and note the start time",
        "Work until your concentration naturally begins to wane",
        "Record how long you worked when you take a break",
        "Take a break proportional to your work time (1:5 ratio)",
        "Track your natural work/break rhythms over time",
        "Gradually extend your flow periods as your concentration improves"
      ]
    }
  ];

  // Handle cursor position updates
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textAreaRef.current) {
      setCursorPosition(textAreaRef.current.selectionStart);
    }
  };

  // Restore cursor position after auto-save
  useEffect(() => {
    if (textAreaRef.current && cursorPosition !== null && !saving) {
      textAreaRef.current.selectionStart = cursorPosition;
      textAreaRef.current.selectionEnd = cursorPosition;
    }
  }, [saving, cursorPosition]);

  // Load existing writing sessions
  const fetchWritingSessions = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('writing_content')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      setAllSessions(data as WritingSession[]);
      
      if (data && data.length > 0 && !currentWritingId) {
        setContent(data[0].content);
        setTitle(data[0].title || "Untitled");
        setCurrentWritingId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching writing sessions:', error);
      toast.error('Failed to load writing sessions');
    } finally {
      setLoading(false);
    }
  }, [currentWritingId]);

  // Load sessions when mode changes to writing
  useEffect(() => {
    if (mode === "writing") {
      fetchWritingSessions();
    }
  }, [mode, fetchWritingSessions]);

  // Save writing content
  const saveContent = async () => {
    if (!content.trim()) return;
    
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (currentWritingId) {
        const { error } = await supabase
          .from('writing_content')
          .update({ 
            content,
            title,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentWritingId);
        
        if (error) throw error;
        toast.success('Writing saved');
      } else {
        const { data, error } = await supabase
          .from('writing_content')
          .insert([{ 
            content,
            title,
            user_id: user.id
          }])
          .select()
          .single();
        
        if (error) throw error;
        setCurrentWritingId(data.id);
        toast.success('New writing session created');
      }
      
      // Refresh the sessions list
      fetchWritingSessions();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  // Auto-save on content change
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (content.trim() && mode === "writing") {
        saveContent();
      }
    }, 2000);
    
    return () => clearTimeout(debounceTimeout);
  }, [content, title, mode]);

  // Create new writing session
  const createNewSession = async () => {
    // If there's unsaved content, confirm before creating new session
    if (content.trim()) {
      const confirmed = window.confirm('Do you want to save the current session before creating a new one?');
      if (confirmed) {
        await saveContent();
      }
    }
    
    // Clear current session and reset states
    setContent("");
    setTitle("Untitled");
    setCurrentWritingId(null);
    setShowSessionsList(false);
    
    // Show feedback
    toast.success('Created new writing container');
    
    // Focus on the textarea with a slight delay to ensure rendering
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }, 100);
  };

  // Load a specific session
  const loadSession = (session: WritingSession) => {
    setContent(session.content);
    setTitle(session.title || "Untitled");
    setCurrentWritingId(session.id);
    setShowSessionsList(false);
  };

  // Delete a session
  const deleteSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('writing_content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Writing session deleted');
      
      // If the current session was deleted
      if (id === currentWritingId) {
        createNewSession();
      }
      
      // Refresh the sessions list
      fetchWritingSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };

  // Apply a specific Pomodoro technique
  const applyTechnique = (technique: PomodoroTechnique) => {
    setActiveTechnique(technique);
    setTimer(technique.workDuration);
    setIsBreak(false);
    setIsActive(false);
    toast.success(`Switched to ${technique.name}`);
  };

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (isActive && timer === 0) {
      setIsActive(false);
      setIsBreak(!isBreak);
      setTimer(isBreak ? activeTechnique.workDuration : activeTechnique.breakDuration);
      
      // Play sound and show notification
      toast.success(isBreak ? "Break over! Time to focus." : "Time for a break!", {
        duration: 5000,
      });
    }
    
    return () => clearInterval(interval);
  }, [isActive, timer, isBreak, activeTechnique]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimer(activeTechnique.workDuration);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const [showExportPreview, setShowExportPreview] = useState(false);
  const [exportPreviewContent, setExportPreviewContent] = useState("");

  const exportContent = () => {
    const textContent = `${title}\n\n${content}`;
    setExportPreviewContent(textContent);
    setShowExportPreview(true);
  };

  const confirmAndExport = async () => {
    try {
      const blob = new Blob([exportPreviewContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Save export history to database
      if (currentWritingId) {
        const exportTimestamp = new Date().toISOString();
        const { data: existingSession } = await supabase
          .from('writing_content')
          .select('export_history, content_history')
          .eq('id', currentWritingId)
          .single();

        const updatedHistory = [
          ...(existingSession?.export_history || []),
          exportTimestamp
        ];

        const updatedContentHistory = [
          ...(existingSession?.content_history || []),
          {
            timestamp: exportTimestamp,
            content,
            title
          }
        ];

        await supabase
          .from('writing_content')
          .update({ 
            export_history: updatedHistory,
            content_history: updatedContentHistory
          })
          .eq('id', currentWritingId);

        // Refresh sessions to update the UI
        fetchWritingSessions();
      }

      setShowExportPreview(false);
      toast.success('Content exported successfully');
    } catch (error) {
      console.error('Error exporting content:', error);
      toast.error('Failed to export content');
    }
  };

  const [showHistoricalContent, setShowHistoricalContent] = useState(false);
  const [historicalContent, setHistoricalContent] = useState("");
  const [selectedExportDate, setSelectedExportDate] = useState("");

  const viewHistoricalContent = async (date: string) => {
    try {
      const session = allSessions.find(s => s.id === currentWritingId);
      const historicalEntry = session?.content_history?.find(h => h.timestamp === date);
      
      if (historicalEntry) {
        setSelectedExportDate(date);
        setHistoricalContent(`${historicalEntry.title}\n\n${historicalEntry.content}`);
        setShowHistoricalContent(true);
      } else {
        toast.error('Historical content not found');
      }
    } catch (error) {
      console.error('Error fetching historical content:', error);
      toast.error('Failed to load historical content');
    }
  };

  const deleteHistoricalContent = async (timestamp: string) => {
    try {
      const session = allSessions.find(s => s.id === currentWritingId);
      if (!session) return;

      const updatedContentHistory = session.content_history?.filter(h => h.timestamp !== timestamp) || [];
      const updatedExportHistory = session.export_history?.filter(d => d !== timestamp) || [];

      await supabase
        .from('writing_content')
        .update({ 
          export_history: updatedExportHistory,
          content_history: updatedContentHistory
        })
        .eq('id', currentWritingId);

      setShowHistoricalContent(false);
      fetchWritingSessions();
      toast.success('Historical version deleted');
    } catch (error) {
      console.error('Error deleting historical content:', error);
      toast.error('Failed to delete historical version');
    }
  };

  return (
    <PageContainer>
      <PageTitle>Focus Mode</PageTitle>
      
      <div className="flex space-x-4 mb-6">
        <Button
          variant={mode === "pomodoro" ? "default" : "outline"}
          onClick={() => setMode("pomodoro")}
          className="flex items-center"
        >
          <Timer className="w-4 h-4 mr-2" />
          <span>Pomodoro Timer</span>
        </Button>
        <Button
          variant={mode === "writing" ? "default" : "outline"}
          onClick={() => setMode("writing")}
          className="flex items-center"
        >
          <Zap className="w-4 h-4 mr-2" />
          <span>Distraction-Free Writing</span>
        </Button>
      </div>
      
      {mode === "pomodoro" ? (
        <TransitionEffect type="fade">
          <GlassCard className="max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-medium mb-2">
                {isBreak ? "Break Time" : "Focus Time"}
              </h2>
              <p className="text-reality-600 dark:text-reality-400 text-sm mb-6">
                {isBreak ? "Take a short break" : "Stay focused on your task"}
              </p>
              
              <div className="text-5xl font-bold mb-8">
                {formatTime(timer)}
              </div>
              
              <div className="flex space-x-4">
                <Button onClick={toggleTimer}>
                  {isActive ? (
                    <Pause className="w-4 h-4 mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  <span>{isActive ? "Pause" : "Start"}</span>
                </Button>
                <Button variant="outline" onClick={resetTimer}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  <span>Reset</span>
                </Button>
              </div>
            </div>
          </GlassCard>
          
          <div className="mt-8 max-w-lg mx-auto">
            <h3 className="text-lg font-medium mb-4">Pomodoro Techniques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {pomodoroTechniques.map((technique) => (
                <GlassPanel 
                  key={technique.name}
                  className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                    activeTechnique.name === technique.name 
                      ? 'border-2 border-primary' 
                      : 'border border-reality-200 dark:border-reality-800'
                  }`}
                  onClick={() => applyTechnique(technique)}
                >
                  <h4 className="font-medium">{technique.name}</h4>
                  <p className="text-sm text-reality-600 dark:text-reality-400 mb-2">
                    {technique.description}
                  </p>
                  <div className="text-xs text-reality-500">
                    Work: {Math.floor(technique.workDuration / 60)}min / 
                    Break: {Math.floor(technique.breakDuration / 60)}min
                  </div>
                </GlassPanel>
              ))}
            </div>
            
            <h3 className="text-lg font-medium mb-4">How to Use: {activeTechnique.name}</h3>
            <ol className="list-decimal pl-5 space-y-2 text-reality-600 dark:text-reality-400">
              {activeTechnique.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </TransitionEffect>
      ) : (
        <TransitionEffect type="fade">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-reality-600" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Untitled"
                    className="bg-transparent border-b border-reality-200 dark:border-reality-700 px-2 py-1 text-lg font-medium focus:outline-none focus:border-reality-500 transition-colors w-full max-w-xs"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={exportContent}
                    title="Export as text file"
                    disabled={!content.trim()}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowSessionsList(!showSessionsList)}
                    title="Show all writing sessions"
                  >
                    <List className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Sessions</span>
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={saveContent}
                    disabled={saving || !content.trim()}
                    title="Save current writing"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save'}</span>
                  </Button>
                </div>
              </div>

              {showSessionsList && allSessions.length > 0 && (
                <GlassPanel className="mb-4 p-2 max-h-48 overflow-y-auto">
                  <ul className="divide-y divide-reality-100 dark:divide-reality-800">
                    {allSessions.map(session => (
                      <li 
                        key={session.id} 
                        className={`flex justify-between items-center py-2 px-3 hover:bg-reality-100/50 dark:hover:bg-reality-800/50 rounded cursor-pointer ${session.id === currentWritingId ? 'bg-reality-100 dark:bg-reality-800' : ''}`}
                      >
                        <div className="flex-1" onClick={() => loadSession(session)}>
                          <p className="font-medium truncate">{session.title || "Untitled"}</p>
                          <p className="text-xs text-reality-500">
                            {formatDate(session.updated_at)} • 
                            {session.content.split(/\s+/).filter(Boolean).length} words
                          </p>
                          {session.export_history && session.export_history.length > 0 && (
                            <div className="text-xs text-green-500 mt-1">
                              <span>Exports: </span>
                              {session.export_history.map((date, i) => (
                                <button
                                  key={i}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    viewHistoricalContent(date);
                                  }}
                                  className="hover:underline mr-2 focus:outline-none"
                                >
                                  {formatDate(date)}
                                  {i < session.export_history!.length - 1 ? "," : ""}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {session.id !== currentWritingId && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 h-8 w-8 p-0 ml-2"
                            onClick={() => deleteSession(session.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </GlassPanel>
              )}

              <GlassPanel intensity="high" className="max-w-3xl mx-auto">
                <textarea
                  ref={textAreaRef}
                  placeholder="Start writing... (saves automatically)"
                  value={content}
                  onChange={handleTextAreaChange}
                  className="w-full min-h-[400px] p-6 bg-transparent resize-none focus:outline-none text-lg"
                  autoFocus
                />
              </GlassPanel>
              
              <div className="mt-4 text-right text-sm text-reality-500">
                {saving ? "Saving..." : content.length > 0 ? `${content.split(/\s+/).filter(Boolean).length} words` : "Start typing..."}
              </div>
            </>
          )}
        </TransitionEffect>
      )}
      {showExportPreview && (
        <GlassPanel className="fixed inset-4 md:inset-10 z-50 overflow-auto p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Export Preview</h3>
            <Button variant="ghost" onClick={() => setShowExportPreview(false)}>×</Button>
          </div>
          <pre className="whitespace-pre-wrap flex-1 p-4 bg-reality-100/50 dark:bg-reality-800/50 rounded">
            {exportPreviewContent}
          </pre>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowExportPreview(false)}>Cancel</Button>
            <Button onClick={confirmAndExport}>Export</Button>
          </div>
        </GlassPanel>
      )}
      {showHistoricalContent && (
        <GlassPanel className="fixed inset-4 md:inset-10 z-50 overflow-auto p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Export from {formatDate(selectedExportDate)}
            </h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this historical version?')) {
                    deleteHistoricalContent(selectedExportDate);
                  }
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={() => setShowHistoricalContent(false)}>×</Button>
            </div>
          </div>
          <pre className="whitespace-pre-wrap flex-1 p-4 bg-reality-100/50 dark:bg-reality-800/50 rounded">
            {historicalContent}
          </pre>
        </GlassPanel>
      )}
    </PageContainer>
  );
}
