
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import React from "react";

interface DemoUploadFilePickerProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBrowseClick: () => void;
  inputFileRef: React.RefObject<HTMLInputElement>;
}

const DemoUploadFilePicker: React.FC<DemoUploadFilePickerProps> = ({
  onFileChange,
  onBrowseClick,
  inputFileRef,
}) => (
  <div className="space-y-4 w-full max-w-md text-center">
    <input
      type="file"
      onChange={onFileChange}
      accept="audio/*"
      ref={inputFileRef}
      className="hidden"
      aria-label="Upload audio file"
    />
    <Button
      type="button"
      variant="outline"
      onClick={onBrowseClick}
      className="w-full border-medical-teal text-medical-teal hover:bg-medical-teal/10"
    >
      Select Audio File
    </Button>
    <p className="text-sm text-gray-500">
      Supported formats: MP3, WAV, OGG, WEBM
    </p>
  </div>
);

export default DemoUploadFilePicker;
