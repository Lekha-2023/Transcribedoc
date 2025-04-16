
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileAudio } from "lucide-react";

interface DropZoneProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

const DropZone = ({ selectedFile, onFileSelect, onFileRemove }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging 
          ? "border-medical-teal bg-medical-teal/10" 
          : "border-gray-300 hover:border-medical-blue"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {!selectedFile ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-medical-teal/10 flex items-center justify-center">
            <Upload className="h-8 w-8 text-medical-teal" />
          </div>
          <div>
            <p className="text-gray-600 mb-2">Drag and drop your audio file here</p>
            <p className="text-gray-500 text-sm">Supported formats: MP3, WAV, OGG, WEBM</p>
          </div>
          <div className="border-t border-gray-200 w-24 my-4"></div>
          <Button 
            type="button" 
            onClick={handleBrowseClick}
            variant="outline"
            className="border-medical-teal text-medical-teal hover:bg-medical-teal/10"
          >
            Browse Files
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="audio/mpeg,audio/wav,audio/mp3,audio/ogg,audio/webm"
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md w-full max-w-md">
            <FileAudio className="h-10 w-10 text-medical-blue" />
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button 
              type="button" 
              onClick={onFileRemove}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;
