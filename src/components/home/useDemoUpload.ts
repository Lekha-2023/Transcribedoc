
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { transcribeDemoAudio } from "@/lib/services/transcription";
import { getFileTypeErrorMsg } from "./DemoUploadUtils";
import { isAuthenticated } from "@/lib/auth"; // Import auth checker

export function useDemoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcript, setTranscript] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleOpenFilePicker = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(null);
    setTranscript("");
    
    if (!file) return;

    // Validate file
    const errorMsg = getFileTypeErrorMsg(file);
    if (errorMsg) {
      setSelectedFile(null);
      setUploadError(errorMsg);
      toast({
        title: "File problem",
        description: errorMsg,
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setTranscript("");
    setUploadError(null);
  };

  const handleDemoClick = async () => {
    if (!selectedFile) {
      setUploadError("No file selected!");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setTranscript("");

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const next = prev + Math.random() * 12;
        return next < 90 ? next : prev;
      });
    }, 450);

    try {
      // NEW: Check auth status and short-circuit if not logged in
      const loggedIn = isAuthenticated && isAuthenticated();

      if (!loggedIn) {
        clearInterval(progressInterval);
        setIsUploading(false);
        setUploadProgress(0);
        setTranscript("");
        toast({
          title: "Create an account to view results",
          description: "Sign up or log in to unlock unlimited and faster transcription.",
          variant: "default",
          action: (
            <>
              <button
                onClick={() => { window.location.href = "/register"; }}
                className="border border-medical-teal text-medical-teal hover:bg-medical-teal/10 px-3 py-1 rounded mr-2"
              >
                Sign Up
              </button>
              <button
                onClick={() => { window.location.href = "/login"; }}
                className="text-medical-blue border border-medical-blue hover:bg-medical-blue/10 px-3 py-1 rounded"
              >
                Login
              </button>
            </>
          ),
        });
        return;
      }

      console.log("Starting transcription for file:", selectedFile.name, "type:", selectedFile.type);
      const result = await transcribeDemoAudio(selectedFile);
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result && result.text) {
        setTranscript(result.text);
        console.log("Transcription result received:", result.text.substring(0, 100) + "...");
        toast({
          title: "Demo Complete!",
          description: "Sign up to unlock unlimited and faster transcription."
        });
      } else {
        throw new Error("No transcription returned, possible file or service error.");
      }
    } catch (error: any) {
      let errMsg: string;
      if (typeof error === "string") errMsg = error;
      else if (error instanceof Error) errMsg = error.message;
      else errMsg = "Unknown error submitting file.";
      
      console.error("Transcription error:", errMsg);
      setUploadError("Transcription failed: " + errMsg);
      toast({
        title: "Transcription Error",
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
    }
  };

  return {
    selectedFile,
    isUploading,
    uploadProgress,
    transcript,
    uploadError,
    inputFileRef,
    handleOpenFilePicker,
    handleFileChange,
    handleRemoveFile,
    handleDemoClick,
  };
}
