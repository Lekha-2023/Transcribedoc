
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated, getCurrentUser, logoutUser } from "@/lib/auth";
import { getUserFiles, FileRecord } from "@/lib/fileUtils";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BulkUploader from "@/components/dashboard/BulkUploader";
import TranscriptionResults from "@/components/dashboard/TranscriptionResults";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Dashboard = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    // First check if we have a local user
    if (!isAuthenticated() || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the dashboard",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    // Then verify Supabase session is valid
    const checkSupabaseAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.log("Supabase session not found, redirecting to login");
        toast({
          title: "Session expired",
          description: "Please log in again to continue",
          variant: "destructive"
        });
        logoutUser(); // Clear local auth state
        navigate("/login");
      }
    };
    
    checkSupabaseAuth();
    loadFiles();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          logoutUser();
          navigate("/login");
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const loadFiles = () => {
    setIsLoading(true);
    
    if (user) {
      const userFiles = getUserFiles(user.id);
      setFiles(userFiles);
    }
    
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logoutUser();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive"
      });
    }
  };

  const handleFileUploaded = () => {
    loadFiles();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={true} onLogout={handleLogout} />
      
      <div className="flex-1 pt-20 pb-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-medical-dark">Welcome, {user.name}</h1>
              <p className="text-gray-500">Manage your audio transcriptions</p>
            </div>
          </div>
          
          <ResizablePanelGroup 
            direction="horizontal" 
            className="min-h-[600px] rounded-lg border"
          >
            {/* Left side: Transcription Results */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="p-6 h-full bg-white">
                <h2 className="text-xl font-semibold mb-4 text-medical-dark">Transcription Results</h2>
                <TranscriptionResults 
                  files={files} 
                  onFilesChanged={loadFiles} 
                  isLoading={isLoading}
                />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Right side: File Upload */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="p-6 h-full bg-white">
                <h2 className="text-xl font-semibold mb-4 text-medical-dark">Upload Audio Files</h2>
                <BulkUploader 
                  userId={user.id} 
                  onFileUploaded={handleFileUploaded} 
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
