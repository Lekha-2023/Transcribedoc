
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { uploadFiles } from "@/lib/fileUtils";
import { getFileTypeErrorMsg } from "@/components/home/DemoUploadUtils";

interface BulkUploaderProps {
  userId: string;
  onFileUploaded: () => void;
}

const BulkUploader = ({ userId, onFileUploaded }: BulkUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const newFiles: File[] = [];
    const rejectedFiles: string[] = [];
    
    Array.from(event.target.files).forEach(file => {
      const errorMsg = getFileTypeErrorMsg(file);
      if (errorMsg) {
        rejectedFiles.push(`${file.name} (${errorMsg})`);
      } else {
        newFiles.push(file);
      }
    });
    
    if (rejectedFiles.length > 0) {
      toast({
        title: `${rejectedFiles.length} file(s) rejected`,
        description: `Only audio files (MP3, WAV, OGG, WEBM) are accepted.`,
        variant: "destructive"
      });
    }
    
    if (newFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
    
    // Reset the input to allow selecting the same files again
    event.target.value = '';
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
  };

  const handleTranscribe = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select audio files to transcribe",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const next = prev + (Math.random() * 5);
        return next < 95 ? next : prev;
      });
    }, 300);

    try {
      const results = await uploadFiles(selectedFiles, userId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const successCount = results.filter(r => r.success).length;
      
      if (successCount > 0) {
        toast({
          title: "Files uploaded successfully",
          description: `${successCount} of ${selectedFiles.length} files have been uploaded and queued for transcription.`
        });
        setSelectedFiles([]);
        onFileUploaded();
      } else {
        toast({
          title: "Upload failed",
          description: "Failed to upload files. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Bulk upload error:", error);
      toast({
        title: "Upload error",
        description: error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive"
      });
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const renderFileList = () => {
    if (selectedFiles.length === 0) {
      return (
        <div className="text-center text-gray-500 p-4">
          No files selected yet
        </div>
      );
    }

    return (
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {selectedFiles.map((file, index) => (
          <div 
            key={`${file.name}-${index}`} 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div className="flex items-center space-x-3 truncate">
              <div className="w-8 h-8 bg-medical-teal/10 rounded-full flex items-center justify-center">
                <Upload className="h-4 w-4 text-medical-teal" />
              </div>
              <div className="truncate max-w-[200px]">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleRemoveFile(index)}
              disabled={isUploading}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-medical-teal/10 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-medical-teal" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Upload Audio Files</h3>
            <p className="text-sm text-gray-500">
              MP3, WAV, OGG, or WEBM format
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <label className="cursor-pointer">
            <Button 
              variant="outline" 
              className="border-medical-teal text-medical-teal hover:bg-medical-teal/10"
              disabled={isUploading}
            >
              Browse Files
            </Button>
            <input 
              type="file" 
              multiple 
              accept="audio/*" 
              onChange={handleFileChange} 
              className="hidden"
              disabled={isUploading}
            />
          </label>
          
          {selectedFiles.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearAll}
              disabled={isUploading}
            >
              Clear All
            </Button>
          )}
        </div>
        
        {renderFileList()}
        
        {selectedFiles.length > 0 && (
          <div className="flex justify-center">
            <Button 
              onClick={handleTranscribe} 
              disabled={isUploading || selectedFiles.length === 0}
              className="w-full max-w-xs bg-medical-teal hover:bg-medical-teal/90 text-white"
            >
              {isUploading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Uploading... {Math.round(uploadProgress)}%</span>
                </div>
              ) : (
                <span>Transcribe {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}</span>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BulkUploader;
