
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { transcribeDemoAudio } from "@/lib/services/transcriptionService";
import DemoUploadFilePicker from "./DemoUploadFilePicker";
import DemoUploadFilePreview from "./DemoUploadFilePreview";
import DemoUploadResult from "./DemoUploadResult";
import DemoUploadError from "./DemoUploadError";

const SUPPORTED_AUDIO_TYPES = {
  "audio/mp3": "mp3",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/ogg": "ogg",
  "audio/webm": "webm"
};

const getFileTypeErrorMsg = (file: File): string | null => {
  if (!file) return "No file selected";
  
  if (file.size === 0) {
    return "The selected file appears to be empty. Please provide a valid audio file (MP3, WAV, OGG, WEBM)";
  }
  
  // More strictly validate audio MIME types
  const validTypes = Object.keys(SUPPORTED_AUDIO_TYPES);
  if (!validTypes.includes(file.type)) {
    // Check file extension as fallback
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !['mp3', 'wav', 'ogg', 'webm'].includes(fileExt)) {
      return `Unsupported audio type: "${file.type || "unknown"}" with extension ".${fileExt || "unknown"}". Please select: MP3, WAV, OGG, or WEBM only.`;
    }
    console.warn(`File MIME type "${file.type}" not recognized, but extension ".${fileExt}" is valid.`);
  }
  
  if (file.size > 15 * 1024 * 1024) {
    return "File too large. Maximum allowed size is 15MB.";
  }
  
  return null;
};

const DemoUpload = () => {
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

    // Log detailed file info for debugging
    console.log("[DemoUpload] File chosen:", file.name, file.type, file.size, "bytes");
    console.log("[DemoUpload] File extension:", file.name.split('.').pop()?.toLowerCase());
    
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
      console.log("[DemoUpload] Submitting for demo transcription:", selectedFile.name, selectedFile.type, selectedFile.size);

      // Perform transcription with simplified approach
      const result = await transcribeDemoAudio(selectedFile);
      
      // Complete the progress
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
      console.error("[DemoUpload] Error:", error);
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

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-medical-dark mb-4">
            Try It Now
          </h2>
          <p className="text-lg text-gray-600">
            Experience the power of AI transcription with a demo upload.<br />
            <span className="text-sm text-gray-500">(MP3, WAV, OGG, or WEBM only. Max 15MB.)</span>
          </p>
        </div>
        <Card className="p-8 bg-white shadow-md">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-medical-teal/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-medical-teal" />
            </div>
            {!selectedFile ? (
              <DemoUploadFilePicker
                onFileChange={handleFileChange}
                onBrowseClick={handleOpenFilePicker}
                inputFileRef={inputFileRef}
              />
            ) : (
              <DemoUploadFilePreview
                file={selectedFile}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                onRemove={handleRemoveFile}
                onDemo={handleDemoClick}
              />
            )}
            {uploadError && <DemoUploadError error={uploadError} />}
            {transcript && <DemoUploadResult transcript={transcript} />}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default DemoUpload;
