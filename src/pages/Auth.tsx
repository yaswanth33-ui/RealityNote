
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassMorphism";
import { TransitionEffect } from "@/components/ui/TransitionEffect";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate("/notes");
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/notes");
        toast.success("Successfully signed in");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Please check your email to confirm your account");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        toast.success("Password reset instructions sent to your email");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-reality-600" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-center min-h-[80vh]">
        <TransitionEffect type="scale">
          <GlassPanel className="w-full max-w-md p-8">
            <form onSubmit={handleAuth} className="space-y-6">
              <h2 className="text-2xl font-semibold text-center mb-6">
                {mode === "signin" ? "Sign In" : mode === "signup" ? "Sign Up" : "Reset Password"}
              </h2>
              
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-reality-200 dark:border-reality-700 rounded bg-white/50 dark:bg-reality-800/50 focus:outline-none focus:ring-1 focus:ring-reality-300"
                  required
                />
                
                {mode !== "forgot" && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-reality-200 dark:border-reality-700 rounded bg-white/50 dark:bg-reality-800/50 focus:outline-none focus:ring-1 focus:ring-reality-300"
                    required
                  />
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : mode === "signin" 
                  ? "Sign In" 
                  : mode === "signup" 
                    ? "Sign Up" 
                    : "Reset Password"}
              </Button>

              <div className="flex flex-col gap-2 text-sm text-center">
                {mode === "signin" ? (
                  <>
                    <button type="button" onClick={() => setMode("signup")} className="text-reality-500 hover:text-reality-600">
                      Don't have an account? Sign Up
                    </button>
                    <button type="button" onClick={() => setMode("forgot")} className="text-reality-500 hover:text-reality-600">
                      Forgot Password?
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setMode("signin")} className="text-reality-500 hover:text-reality-600">
                    Already have an account? Sign In
                  </button>
                )}
              </div>
            </form>
          </GlassPanel>
        </TransitionEffect>
      </div>
    </PageContainer>
  );
}
