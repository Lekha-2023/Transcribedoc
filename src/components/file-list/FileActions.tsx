
import { Mail, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileActionsProps {
  fileId: string;
  sendingEmail: string | null;
  onSendResults: (fileId: string) => void;
  onDelete: (fileId: string) => void;
}

export const FileActions = ({
  fileId,
  sendingEmail,
  onSendResults,
  onDelete,
}: FileActionsProps) => {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => onSendResults(fileId)}
              disabled={!!sendingEmail}
            >
              {sendingEmail === fileId ? (
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
      
      <Button 
        variant="outline" 
        size="sm"
        className="ml-auto flex items-center space-x-1 text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={() => onDelete(fileId)}
      >
        <Trash className="h-4 w-4" />
        <span>Delete</span>
      </Button>
    </div>
  );
};

