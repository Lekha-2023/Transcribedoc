
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileStatus } from "./FileStatus";
import { FileActions } from "./FileActions";
import { FileRecord } from "@/lib/fileUtils";

interface FileCardProps {
  file: FileRecord;
  sendingEmail: string | null;
  onSendResults: (fileId: string) => void;
  onDelete: (fileId: string) => void;
}

export const FileCard = ({ 
  file, 
  sendingEmail,
  onSendResults,
  onDelete 
}: FileCardProps) => {
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

  return (
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
        
        <FileStatus status={file.status} />
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
              
              <FileActions
                fileId={file.id}
                sendingEmail={sendingEmail}
                onSendResults={onSendResults}
                onDelete={onDelete}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </Card>
  );
};

