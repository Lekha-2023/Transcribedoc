
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Upload, Mic, User } from "lucide-react";
import { isAuthenticated, getCurrentUser, logoutUser } from "@/lib/auth";
import { getUserFiles, FileRecord } from "@/lib/fileUtils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AudioUploader from "@/components/AudioUploader";
import FileList from "@/components/FileList";
import { supabase } from "@/integrations/supabase/client";

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
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-medical-dark">Welcome, {user.name}</h1>
              <p className="text-gray-500">Manage your audio transcriptions</p>
            </div>
            
            <Card className="mt-4 md:mt-0 p-3 flex items-center space-x-2 bg-white">
              <div className="bg-medical-teal/10 p-2 rounded-full">
                <User className="h-5 w-5 text-medical-teal" />
              </div>
              <div>
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-gray-500">Joined {new Date().toLocaleDateString()}</p>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-4 bg-gradient-to-br from-medical-teal to-medical-blue text-white shadow-md">
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total Transcriptions</p>
                  <p className="text-2xl font-bold">{files.length}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-medical-blue to-medical-light text-white shadow-md">
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <Mic className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold">{files.filter(f => f.status === 'completed').length}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow-md">
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium">In Progress</p>
                  <p className="text-2xl font-bold">{files.filter(f => f.status === 'processing').length}</p>
                </div>
              </div>
            </Card>
          </div>
          
          <Tabs defaultValue="files" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="files">My Transcriptions</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
            </TabsList>
            
            <TabsContent value="files" className="mt-0">
              <FileList 
                files={files} 
                onFilesChanged={loadFiles} 
              />
            </TabsContent>
            
            <TabsContent value="upload" className="mt-0">
              <AudioUploader 
                userId={user.id} 
                onFileUploaded={handleFileUploaded} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
