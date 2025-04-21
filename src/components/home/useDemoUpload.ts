
import { useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { transcribeDemoAudio } from "@/lib/services/transcriptionService";
import { getFileTypeErrorMsg } from "./DemoUploadUtils";

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

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const next = prev + Math.random() * 12;
        return next < 90 ? next : prev;
      });
    }, 450);

    try {
      const result = await transcribeDemoAudio(selectedFile);
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.text) {
        setTranscript(result.text);
        toast({
          title: "Demo Complete!",
          description: "Sign up to unlock unlimited and faster transcription.",
          action: (
            <Button
              onClick={() => window.location.href = "/register"}
              variant="outline"
              className="border-medical-teal text-medical-teal hover:bg-medical-teal/10"
            >
              Sign Up
            </Button>
          ),
        });
      } else {
        throw new Error("No transcription returned, possible file or service error.");
      }
    } catch (error: any) {
      let errMsg: string;
      if (typeof error === "string") errMsg = error;
      else if (error instanceof Error) errMsg = error.message;
      else errMsg = "Unknown error submitting file.";
      
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
