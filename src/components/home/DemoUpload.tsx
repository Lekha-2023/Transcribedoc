
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
    if (file) {
      // Validate file type before setting
      const validAudioTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'];
      if (!validAudioTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid audio file (MP3, WAV, OGG, WEBM)",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 15MB)
      if (file.size > 15 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an audio file under 15MB",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Selected file:", file.name, "type:", file.type, "size:", (file.size / 1024 / 1024).toFixed(2) + "MB");
      setSelectedFile(file);
      setTranscript("");
      setUploadError(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setTranscript("");
    setUploadError(null);
  };

  const handleDemoClick = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        return newProgress < 90 ? newProgress : prev;
      });
    }, 500);

    try {
      console.log("Starting demo transcription for file:", selectedFile.name, "type:", selectedFile.type);

      // Use the demo transcription method with base64 encoding
      const transcriptionResult = await transcribeDemoAudio(selectedFile);
      console.log("Transcription completed:", transcriptionResult);

      setUploadProgress(100);

      if (transcriptionResult.text) {
        setTranscript(transcriptionResult.text);

        toast({
          title: "Demo Complete",
          description: "Sign up to unlock full transcription capabilities!",
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
        throw new Error("No transcription text returned");
      }
    } catch (error) {
      console.error("Demo transcription error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setUploadError(`Transcription failed: ${errorMessage}`);
      toast({
        title: "Error",
        description: "Failed to process the file. Please try again with a different audio file.",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0); // Reset progress on completion
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
            Experience the power of AI transcription with a demo upload
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
