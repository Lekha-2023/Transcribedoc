
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/lib/fileUtils";
import SubscriptionPrompt from "@/components/subscription/SubscriptionPrompt";
import DropZone from "@/components/upload/DropZone";
import UploadProgress from "@/components/upload/UploadProgress";
import { useUploadLimit } from "@/hooks/useUploadLimit";

interface AudioUploaderProps {
  userId: string;
  onFileUploaded: () => void;
}

const AudioUploader = ({ userId, onFileUploaded }: AudioUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const { toast } = useToast();
  const { isLimitReached, checkSubscriptionRequired, incrementUploadCount } = useUploadLimit(userId);

  useEffect(() => {
    // Check if subscription is required on component mount
    const limitReached = checkSubscriptionRequired();
    setShowSubscriptionPrompt(limitReached);
    
    // Check authentication status on component mount and set up listener
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      console.log("Auth check in AudioUploader:", !!data.session);
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        console.log("Auth state changed:", event, !!session);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [checkSubscriptionRequired]);

  const handleFileSelect = (file: File) => {
    // If limit is reached, show subscription prompt
    if (checkSubscriptionRequired()) {
      setShowSubscriptionPrompt(true);
      return;
    }
    
    // Check if file is an audio file
    const validAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/webm'];
    
    if (!validAudioTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select an audio file (MP3, WAV, OGG, WEBM)",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) return;
    
    // Check if user needs subscription
    if (checkSubscriptionRequired()) {
      setShowSubscriptionPrompt(true);
      return;
    }
    
    // Check authentication again right before upload
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      toast({
        title: "Authentication required",
        description: "Your session has expired. Please log out and log in again.",
        variant: "destructive"
      });
      setIsAuthenticated(false);
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress < 90 ? newProgress : prev;
      });
    }, 300);
    
    try {
      console.log("Starting file upload with authenticated status:", isAuthenticated);
      const result = await uploadFile(selectedFile, userId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success) {
        // Increment upload count and check if limit is reached
        incrementUploadCount();
        
        toast({
          title: "Upload successful",
          description: `${selectedFile.name} has been uploaded and is being processed.`,
        });
        
        setSelectedFile(null);
        onFileUploaded();
        
        // Check if we've now reached the limit after this upload
        if (checkSubscriptionRequired()) {
          setShowSubscriptionPrompt(true);
        }
      } else {
        toast({
          title: "Upload failed",
          description: result.message || "An error occurred during upload",
          variant: "destructive"
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      
      toast({
        title: "Upload error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const closeSubscriptionPrompt = () => {
    setShowSubscriptionPrompt(false);
  };

  // Show subscription prompt if limit reached
  if (showSubscriptionPrompt) {
    return (
      <Card className="p-6 bg-white shadow-md">
        <SubscriptionPrompt onClose={closeSubscriptionPrompt} />
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white shadow-md">
      <h2 className="text-xl font-semibold text-medical-dark mb-4">Upload Audio File</h2>
      
      <DropZone 
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        onFileRemove={() => setSelectedFile(null)}
      />

      {selectedFile && (
        <div className="mt-6 flex justify-center">
          <UploadProgress 
            uploadProgress={uploadProgress}
            onUpload={handleUpload}
            isUploading={isUploading}
          />
        </div>
      )}
    </Card>
  );
};

export default AudioUploader;
