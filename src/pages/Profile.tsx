import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { PageContainer, PageTitle } from "@/components/layout/PageContainer";
import { GlassCard } from "@/components/ui/GlassMorphism";
import { TransitionEffect } from "@/components/ui/TransitionEffect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, LogOut, Mail, User, Shield, Clock, FileText } from "lucide-react";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [notesCount, setNotesCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const navigate = useNavigate();

  const fetchUserActivity = async (userId: string) => {
    try {
      // Fetch notes count
      const { count: notesCount, error: notesError } = await supabase
        .from('notes')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      if (notesError) throw notesError;

      // Fetch tasks count
      const { count: tasksCount, error: tasksError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      if (tasksError) throw tasksError;

      setNotesCount(notesCount || 0);
      setTasksCount(tasksCount || 0);
    } catch (error) {
      console.error('Error fetching activity counts:', error);
      toast.error('Failed to load activity data');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/auth");
          return;
        }
        
        setUserEmail(session.user.email);
        setCreatedAt(session.user.created_at);
        await fetchUserActivity(session.user.id);
      } catch (error) {
        console.error("Error fetching user session:", error);
        toast.error("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Successfully signed out");
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userEmail) return "U";
    return userEmail.charAt(0).toUpperCase();
  };

  return (
    <PageContainer>
      <PageTitle>User Profile</PageTitle>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="w-8 h-8 animate-spin text-reality-600" />
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <TransitionEffect type="slide">
            <div className="flex flex-col items-center justify-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="bg-primary text-xl">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{userEmail}</h2>
              <p className="text-sm text-reality-500 dark:text-reality-400">
                Member since {formatDate(createdAt)}
              </p>
            </div>

            <GlassCard className="mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-reality-100 dark:bg-reality-800 p-2 rounded-lg">
                    <User className="w-5 h-5 text-reality-600 dark:text-reality-400" />
                  </span>
                  <h3 className="font-medium">Account Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-reality-50 dark:bg-reality-900 rounded-lg">
                    <Mail className="w-5 h-5 text-reality-600 dark:text-reality-400" />
                    <div>
                      <p className="text-sm text-reality-500 dark:text-reality-400">Email</p>
                      <p className="font-medium">{userEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-reality-50 dark:bg-reality-900 rounded-lg">
                    <Clock className="w-5 h-5 text-reality-600 dark:text-reality-400" />
                    <div>
                      <p className="text-sm text-reality-500 dark:text-reality-400">Account Created</p>
                      <p className="font-medium">{formatDate(createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-reality-100 dark:bg-reality-800 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-reality-600 dark:text-reality-400" />
                  </span>
                  <h3 className="font-medium">Account Activity</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-reality-50 dark:bg-reality-900 rounded-lg text-center">
                    <h4 className="font-medium text-xl">{notesCount}</h4>
                    <p className="text-sm text-reality-500 dark:text-reality-400">Notes</p>
                  </div>
                  <div className="p-4 bg-reality-50 dark:bg-reality-900 rounded-lg text-center">
                    <h4 className="font-medium text-xl">{tasksCount}</h4>
                    <p className="text-sm text-reality-500 dark:text-reality-400">Tasks</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-reality-100 dark:bg-reality-800 p-2 rounded-lg">
                    <LogOut className="w-5 h-5 text-reality-600 dark:text-reality-400" />
                  </span>
                  <h3 className="font-medium">Account Actions</h3>
                </div>

                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </>
                  )}
                </Button>
              </div>
            </GlassCard>
          </TransitionEffect>
        </div>
      )}
    </PageContainer>
  );
}
