import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, FileText, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { uploadFile } from "@/lib/fileUtils";
import { getFileTypeErrorMsg } from "@/components/home/DemoUploadUtils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BulkUploaderProps {
  userId: string;
  onFileUploaded: () => void;
}

interface TranscriptionResult {
  fileName: string;
  text: string;
  success: boolean;
  error?: string;
}

const BulkUploader = ({ userId, onFileUploaded }: BulkUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcriptionResults, setTranscriptionResults] = useState<TranscriptionResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      setTranscriptionResults([]); // Clear previous results when new files are added
    }
    
    event.target.value = '';
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setTranscriptionResults([]);
  };

  const handleCopyText = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({
      title: "Copied!",
      description: "Transcription copied to clipboard"
    });
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
    setTranscriptionResults([]);

    const results: TranscriptionResult[] = [];
    const totalFiles = selectedFiles.length;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setUploadProgress(((i) / totalFiles) * 100);

      try {
        const result = await uploadFile(file, userId);
        results.push({
          fileName: file.name,
          text: result.fileRecord?.transcriptText || "",
          success: result.success,
          error: result.message
        });
      } catch (error) {
        results.push({
          fileName: file.name,
          text: "",
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    setUploadProgress(100);
    setTranscriptionResults(results);
    
    const successCount = results.filter(r => r.success).length;
    
    if (successCount > 0) {
      toast({
        title: "Transcription complete",
        description: `${successCount} of ${selectedFiles.length} files transcribed successfully.`
      });
      setSelectedFiles([]);
      onFileUploaded();
    } else {
      toast({
        title: "Transcription failed",
        description: "Failed to transcribe files. Please try again.",
        variant: "destructive"
      });
    }

    setIsUploading(false);
    setUploadProgress(0);
  };

  const renderFileList = () => {
    if (selectedFiles.length === 0) {
      return (
        <div className="text-center text-muted-foreground p-4">
          No files selected yet
        </div>
      );
    }

    return (
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {selectedFiles.map((file, index) => (
          <div 
            key={`${file.name}-${index}`} 
            className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
          >
            <div className="flex items-center space-x-3 truncate">
              <div className="w-8 h-8 bg-medical-teal/10 rounded-full flex items-center justify-center">
                <Upload className="h-4 w-4 text-medical-teal" />
              </div>
              <div className="truncate max-w-[200px]">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
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

  const renderTranscriptionResults = () => {
    if (transcriptionResults.length === 0) return null;

    return (
      <div className="mt-6 space-y-4">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-medical-teal" />
          Transcription Results
        </h4>
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-4 pr-4">
            {transcriptionResults.map((result, index) => (
              <Card key={index} className={`p-4 ${result.success ? 'border-green-200' : 'border-red-200'}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h5 className="font-medium text-sm truncate flex-1">{result.fileName}</h5>
                  {result.success && result.text && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyText(result.text, index)}
                      className="shrink-0"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                {result.success ? (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {result.text || "No transcription text available"}
                  </p>
                ) : (
                  <p className="text-sm text-destructive">
                    Error: {result.error || "Transcription failed"}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
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
            <p className="text-sm text-muted-foreground">
              MP3, WAV, OGG, or WEBM format
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <Button 
            variant="outline" 
            className="border-medical-teal text-medical-teal hover:bg-medical-teal/10"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            Browse Files
          </Button>
          <input 
            ref={fileInputRef}
            type="file" 
            multiple 
            accept="audio/*" 
            onChange={handleFileChange} 
            className="hidden"
            disabled={isUploading}
          />
          
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
                  <span>Transcribing... {Math.round(uploadProgress)}%</span>
                </div>
              ) : (
                <span>Transcribe {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}</span>
              )}
            </Button>
          </div>
        )}

        {renderTranscriptionResults()}
      </div>
    </Card>
  );
};

export default BulkUploader;
