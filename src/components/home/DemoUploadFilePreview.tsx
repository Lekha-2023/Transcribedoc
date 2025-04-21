
import React from "react";
import { FileAudio, X } from "lucide-react";
import UploadProgress from "@/components/upload/UploadProgress";

interface DemoUploadFilePreviewProps {
  file: File;
  isUploading: boolean;
  uploadProgress: number;
  onRemove: () => void;
  onDemo: () => void;
}

const DemoUploadFilePreview = ({
  file,
  isUploading,
  uploadProgress,
  onRemove,
  onDemo,
}: DemoUploadFilePreviewProps) => {
  const handleTryTranscription = () => {
    if (!isUploading) {
      onDemo();
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md w-full">
        <FileAudio className="h-10 w-10 text-medical-blue flex-shrink-0" />
        <div className="flex-1 truncate">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        {!isUploading && (
          <button
            type="button"
            onClick={onRemove}
            className="text-gray-400 hover:text-gray-500 flex-shrink-0"
            disabled={isUploading}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <UploadProgress
          uploadProgress={uploadProgress}
          onUpload={handleTryTranscription}
          isUploading={isUploading}
        />
      </div>
    </div>
  );
};

export default DemoUploadFilePreview;
