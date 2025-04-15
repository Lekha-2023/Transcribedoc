
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X, FileAudio } from "lucide-react";
import { uploadFile } from "@/lib/fileUtils";

interface AudioUploaderProps {
  userId: string;
  onFileUploaded: () => void;
}

const AudioUploader = ({ userId, onFileUploaded }: AudioUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Check if file is an audio file
    const validAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/webm'];
    
    if (!validAudioTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select an audio file (MP3, WAV, OGG, WEBM)",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress < 90 ? newProgress : prev;
      });
    }, 300);
    
    try {
      const result = await uploadFile(selectedFile, userId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success) {
        toast({
          title: "Upload successful",
          description: `${selectedFile.name} has been uploaded and is being processed.`,
        });
        
        setSelectedFile(null);
        onFileUploaded();
      } else {
        toast({
          title: "Upload failed",
          description: result.message || "An error occurred during upload",
          variant: "destructive"
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      
      toast({
        title: "Upload error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-md">
      <h2 className="text-xl font-semibold text-medical-dark mb-4">Upload Audio File</h2>
      
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
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {isUploading ? (
              <div className="w-full max-w-md">
                <Progress value={uploadProgress} className="h-2 mb-2" />
                <p className="text-sm text-gray-500 text-center">
                  {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
                </p>
              </div>
            ) : (
              <Button
                type="button"
                onClick={handleUpload}
                className="bg-medical-teal hover:bg-medical-teal/90 text-white"
              >
                Upload & Transcribe
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default AudioUploader;
