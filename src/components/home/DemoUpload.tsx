
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import DemoUploadFilePicker from "./DemoUploadFilePicker";
import DemoUploadFilePreview from "./DemoUploadFilePreview";
import DemoUploadResult from "./DemoUploadResult";
import DemoUploadError from "./DemoUploadError";
import { useDemoUpload } from "./useDemoUpload";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const demoMainBg =
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80"; // Healthcare professionals

const DemoUpload = () => {
  const {
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
  } = useDemoUpload();

  // We need to customize the toast component since we can't use JSX in the hook
  const { toast } = useToast();

  // Create a helper to render the button for the toast
  const createSignUpButton = () => {
    return (
      <Button
        onClick={() => window.location.href = "/register"}
        variant="outline"
        className="border-medical-teal text-medical-teal hover:bg-medical-teal/10"
      >
        Sign Up
      </Button>
    );
  };

  // Update the toast handler
  useEffect(() => {
    if (transcript) {
      toast({
        title: "Demo Complete!",
        description: "Sign up to unlock unlimited and faster transcription.",
        action: createSignUpButton()
      });
    }
  }, [transcript]);

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
            {/* Circular background main icon area */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center relative mb-4"
              style={{
                backgroundImage: `url(${demoMainBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden',
                boxShadow: '0 2px 16px 0 rgba(30, 174, 219, 0.12)',
              }}
            >
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-medical-blue/80 rounded-full pointer-events-none"></div>
              <Upload className="h-8 w-8 text-white z-10" />
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
