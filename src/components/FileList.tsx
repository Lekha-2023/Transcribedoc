
import { useState } from "react";
import { 
  FileText, 
  FilePdf, 
  FileCheck, 
  Mail, 
  Download, 
  Trash, 
  Loader2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCurrentUser } from "@/lib/auth";
import { FileRecord, deleteFile, sendResultsViaEmail } from "@/lib/fileUtils";

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  if (files.length === 0) {
    return (
      <Card className="p-6 bg-white shadow-md text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No files yet</h3>
          <p className="text-gray-500 max-w-md">
            Upload an audio file to see your transcriptions here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-medical-dark">Your Transcriptions</h2>
      
      <div className="space-y-4">
        {files.map((file) => (
          <Card key={file.id} className="p-0 overflow-hidden bg-white shadow-md">
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-medical-gray rounded-md">
                  <FileText className="h-6 w-6 text-medical-blue" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{file.originalFileName}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(file.uploadDate)} • {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {file.status === 'processing' ? (
                  <div className="flex items-center text-amber-500">
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    <span className="text-sm">Processing</span>
                  </div>
                ) : file.status === 'failed' ? (
                  <div className="flex items-center text-red-500">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Failed</span>
                  </div>
                ) : (
                  <div className="flex items-center text-green-500">
                    <FileCheck className="h-4 w-4 mr-1" />
                    <span className="text-sm">Completed</span>
                  </div>
                )}
              </div>
            </div>
            
            {file.status === 'completed' && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="transcript">
                  <AccordionTrigger className="px-4 py-2 text-sm hover:no-underline hover:bg-gray-50">
                    View Transcript
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-700">
                      {file.transcriptText}
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center space-x-1"
                              onClick={() => handleSendResults(file.id)}
                              disabled={!!sendingEmail}
                            >
                              {sendingEmail === file.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Mail className="h-4 w-4" />
                              )}
                              <span>Email Results</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Send transcript to your email</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      {file.downloadLinks && (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex items-center space-x-1"
                                >
                                  <Download className="h-4 w-4" />
                                  <span>TXT</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download as text file</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex items-center space-x-1"
                                >
                                  <Download className="h-4 w-4" />
                                  <span>DOC</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download as Word document</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex items-center space-x-1"
                                >
                                  <FilePdf className="h-4 w-4" />
                                  <span>PDF</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download as PDF document</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="ml-auto flex items-center space-x-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeletingFile(file.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </Card>
        ))}
      </div>
      
      <Dialog open={!!deletingFile} onOpenChange={(open) => !open && setDeletingFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transcription</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transcription? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingFile(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deletingFile && handleDelete(deletingFile)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileList;
