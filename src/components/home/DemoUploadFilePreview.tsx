
import { FileAudio, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import React from "react";

interface DemoUploadFilePreviewProps {
  file: File;
  isUploading: boolean;
  uploadProgress: number;
  onRemove: () => void;
  onDemo: () => void;
}

const DemoUploadFilePreview: React.FC<DemoUploadFilePreviewProps> = ({
  file,
  isUploading,
  uploadProgress,
  onRemove,
  onDemo,
}) => (
  <div className="w-full max-w-md">
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
      <div className="flex items-center space-x-3">
        <FileAudio className="h-10 w-10 text-medical-blue" />
        <div className="flex-1 truncate">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-gray-500"
        type="button"
        aria-label="Remove file"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
    <div className="mt-6 space-y-4">
      {isUploading ? (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-center text-gray-500">
            {uploadProgress < 100 ? "Processing..." : "Almost done..."}
          </p>
        </div>
      ) : (
        <Button
          onClick={onDemo}
          className="w-full bg-medical-teal hover:bg-medical-teal/90 text-white"
          disabled={isUploading}
        >
          Try Transcription
        </Button>
      )}
    </div>
  </div>
);

export default DemoUploadFilePreview;
