
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/auth";
import { FileRecord, deleteFile, sendResultsViaEmail } from "@/lib/fileUtils";
import { Loader2, Download, Mail, Trash } from "lucide-react";
import { downloadTranscription } from "@/lib/services/transcription";

interface TranscriptionResultsProps {
  files: FileRecord[];
  onFilesChanged: () => void;
  isLoading: boolean;
}

const TranscriptionResults = ({ 
  files, 
  onFilesChanged, 
  isLoading 
}: TranscriptionResultsProps) => {
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const { toast } = useToast();
  const user = getCurrentUser();

  const handleDownload = async (file: FileRecord) => {
    if (!file.transcriptText) {
      toast({
        title: "No transcription available",
        description: "This file hasn't been transcribed yet",
        variant: "destructive"
      });
      return;
    }

    setDownloading(file.id);
    
    try {
      await downloadTranscription(file);
      toast({
        title: "Download successful",
        description: "Your transcription has been downloaded"
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "Failed to download transcription",
        variant: "destructive"
      });
    } finally {
      setDownloading(null);
    }
  };

  const handleSendEmail = async (fileId: string) => {
    if (!user?.email) {
      toast({
        title: "Email not available",
        description: "Your account doesn't have an email address",
        variant: "destructive"
      });
      return;
    }

    setSendingEmail(fileId);
    
    try {
      const result = await sendResultsViaEmail(fileId, user.id, user.email);
      
      if (result.success) {
        toast({
          title: "Email sent",
          description: result.message
        });
      } else {
        toast({
          title: "Failed to send email",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Email sending error:", error);
      toast({
        title: "Email error",
        description: "An unexpected error occurred while sending the email",
        variant: "destructive"
      });
    } finally {
      setSendingEmail(null);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!user) return;
    
    try {
      await deleteFile(fileId, user.id);
      toast({
        title: "File deleted",
        description: "The file and its transcription have been deleted"
      });
      onFilesChanged();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the file",
        variant: "destructive"
      });
    }
  };

  // Filter for completed transcriptions
  const completedFiles = files.filter(file => file.status === "completed");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-medical-teal" />
      </div>
    );
  }

  if (completedFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">No transcriptions yet</h3>
        <p className="text-gray-500 max-w-md">
          Upload audio files using the uploader on the right to start transcribing content
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{completedFiles.length} Transcription{completedFiles.length !== 1 ? 's' : ''}</h3>
      </div>
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {completedFiles.map((file) => (
          <Card key={file.id} className="p-4">
            <div className="flex flex-col">
              <div className="flex justify-between items-start">
                <h4 className="font-medium truncate max-w-[70%]" title={file.originalFileName}>
                  {file.originalFileName}
                </h4>
                <div className="text-xs text-gray-500">
                  {new Date(file.uploadDate).toLocaleDateString()}
                </div>
              </div>
              
              {file.transcriptText && (
                <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-md max-h-24 overflow-y-auto">
                  <p className="line-clamp-3">{file.transcriptText}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => handleDownload(file)}
                  disabled={downloading === file.id}
                >
                  {downloading === file.id ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      <span>Downloading</span>
                    </>
                  ) : (
                    <>
                      <Download className="mr-1 h-3 w-3" />
                      <span>Download</span>
                    </>
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="text-medical-teal border-medical-teal/30 hover:bg-medical-teal/10"
                  onClick={() => handleSendEmail(file.id)}
                  disabled={sendingEmail === file.id}
                >
                  {sendingEmail === file.id ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      <span>Sending</span>
                    </>
                  ) : (
                    <>
                      <Mail className="mr-1 h-3 w-3" />
                      <span>Email Results</span>
                    </>
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 ml-auto"
                  onClick={() => handleDelete(file.id)}
                >
                  <Trash className="mr-1 h-3 w-3" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TranscriptionResults;
