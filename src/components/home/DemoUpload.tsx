
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import DemoUploadFilePicker from "./DemoUploadFilePicker";
import DemoUploadFilePreview from "./DemoUploadFilePreview";
import DemoUploadResult from "./DemoUploadResult";
import DemoUploadError from "./DemoUploadError";
import { useDemoUpload } from "./useDemoUpload";

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
