
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentUser } from "@/lib/auth";
import { FileRecord, deleteFile, sendResultsViaEmail } from "@/lib/fileUtils";
import { NoFiles } from "./file-list/NoFiles";
import { FileCard } from "./file-list/FileCard";
import { DeleteDialog } from "./file-list/DeleteDialog";

interface FileListProps {
  files: FileRecord[];
  onFilesChanged: () => void;
}

const FileList = ({ files, onFilesChanged }: FileListProps) => {
  const { toast } = useToast();
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const user = getCurrentUser();

  const handleDelete = async (fileId: string) => {
    setDeletingFile(null);
    
    if (!user) return;
    
    const success = deleteFile(fileId, user.id);
    
    if (success) {
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully"
      });
      onFilesChanged();
    } else {
      toast({
        title: "Delete failed",
        description: "The file could not be deleted",
        variant: "destructive"
      });
    }
  };

  const handleSendResults = async (fileId: string) => {
    if (!user) return;
    
    setSendingEmail(fileId);
    
    try {
      const result = await sendResultsViaEmail(fileId, user.id, user.email);
      
      if (result.success) {
        toast({
          title: "Results sent",
          description: result.message
        });
      } else {
        toast({
          title: "Failed to send results",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setSendingEmail(null);
    }
  };

  if (files.length === 0) {
    return <NoFiles />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-medical-dark">Your Transcriptions</h2>
      
      <div className="space-y-4">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            sendingEmail={sendingEmail}
            onSendResults={handleSendResults}
            onDelete={setDeletingFile}
          />
        ))}
      </div>
      
      <DeleteDialog
        isOpen={!!deletingFile}
        onClose={() => setDeletingFile(null)}
        onConfirm={() => deletingFile && handleDelete(deletingFile)}
      />
    </div>
  );
};

export default FileList;
