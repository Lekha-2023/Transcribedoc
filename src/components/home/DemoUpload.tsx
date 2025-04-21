
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileAudio, Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { uploadToStorage } from "@/lib/storage/fileStorage";
import { transcribeAudio } from "@/lib/services/transcriptionService";

const DemoUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcript, setTranscript] = useState<string>("");
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleOpenFilePicker = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("audio/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an audio file (MP3, WAV, OGG, WEBM)",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setTranscript("");
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setTranscript("");
  };

  const handleDemoClick = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        return newProgress < 90 ? newProgress : prev;
      });
    }, 500);

    try {
      // Generate a temporary demo file ID, store under 'demo' user
      const demoFileId = `demo_${Date.now()}`;

      // Upload the file
      const publicUrl = await uploadToStorage(selectedFile, "demo", demoFileId);

      // Call transcription
      const transcriptionResult = await transcribeAudio(publicUrl);
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
      }
    } catch (error) {
      console.error("Demo transcription error:", error);
      toast({
        title: "Error",
        description: "Failed to process the file. Please try again.",
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
            Experience the power of AI transcription with a demo upload
          </p>
        </div>

        <Card className="p-8 bg-white shadow-md">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-medical-teal/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-medical-teal" />
            </div>

            {!selectedFile ? (
              <div className="space-y-4 w-full max-w-md text-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="audio/*"
                  ref={inputFileRef}
                  className="hidden"
                  aria-label="Upload audio file"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleOpenFilePicker}
                  className="w-full border-medical-teal text-medical-teal hover:bg-medical-teal/10"
                >
                  Select Audio File
                </Button>
                <p className="text-sm text-gray-500">
                  Supported formats: MP3, WAV, OGG, WEBM
                </p>
              </div>
            ) : (
              <div className="w-full max-w-md">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FileAudio className="h-10 w-10 text-medical-blue" />
                    <div className="flex-1 truncate">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {isUploading ? (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-sm text-center text-gray-500">
                        {uploadProgress < 100
                          ? "Processing..."
                          : "Almost done..."}
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={handleDemoClick}
                      className="w-full bg-medical-teal hover:bg-medical-teal/90 text-white"
                      disabled={isUploading}
                    >
                      Try Transcription
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Result Section - always visible if transcript exists */}
            {transcript && (
              <div className="w-full max-w-md mt-8">
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-medical-dark mb-2 text-center">
                    Result
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-md shadow-inner">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {transcript}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default DemoUpload;
