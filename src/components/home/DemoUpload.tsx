
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
import { isAuthenticated } from "@/lib/auth";

// Changed background image to new user-provided healthcare illustration
const demoMainBg =
  "/lovable-uploads/138ce85f-e38f-4e09-b9b9-06f97412ab40.png";

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

  const { toast } = useToast();
  const isLoggedIn = isAuthenticated && isAuthenticated();

  const handleSignUpClick = () => {
    window.location.href = "/register";
  };

  const handleLoginClick = () => {
    window.location.href = "/login";
  };

  useEffect(() => {
    if (transcript && isLoggedIn) {
      toast({
        title: "Demo Complete!",
        description: "Sign up to unlock unlimited and faster transcription.",
        action: {
          label: "Sign Up",
          onClick: handleSignUpClick
        }
      });
    }
  }, [transcript, isLoggedIn]);

  return (
    <section
      id="demo-section"
      className="py-20 px-4 relative"
      style={{
        backgroundImage: `url(${demoMainBg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <p className="text-2xl md:text-3xl text-black font-semibold mb-6">
            Experience the power of AI transcription with a demo upload.
          </p>
          <p className="text-sm text-black-300">
            Upload any MP3, WAV, OGG, or WEBM audio file (max 15MB).
          </p>
        </div>
        <Card className="p-8 bg-white/95 shadow-md relative z-10">
          <div className="flex flex-col items-center space-y-6">
            {/* Circular background main icon area */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center relative mb-4"
              style={{
                boxShadow: "0 2px 16px 0 rgba(30, 174, 219, 0.12)",
                backgroundColor: "transparent",
              }}
            >
              {/* Overlay for icon area */}
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
            {transcript && isLoggedIn && <DemoUploadResult transcript={transcript} />}
            
            {/* Show auth options if not logged in */}
            {(!isLoggedIn && selectedFile && !isUploading) && (
              <div className="w-full max-w-md mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-center text-gray-600 mb-3">
                  Create an account to view transcription results
                </p>
                <div className="flex justify-center space-x-3">
                  <Button 
                    onClick={handleSignUpClick}
                    variant="outline" 
                    className="border-medical-teal text-medical-teal hover:bg-medical-teal/10"
                  >
                    Sign Up
                  </Button>
                  <Button 
                    onClick={handleLoginClick}
                    variant="outline"
                    className="border-medical-blue text-medical-blue hover:bg-medical-blue/10"
                  >
                    Login
                  </Button>
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
