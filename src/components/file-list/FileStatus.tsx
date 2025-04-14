
import { Loader2, AlertTriangle, FileCheck } from "lucide-react";

interface FileStatusProps {
  status: 'processing' | 'failed' | 'completed';
}

export const FileStatus = ({ status }: FileStatusProps) => {
  if (status === 'processing') {
    return (
      <div className="flex items-center text-amber-500">
        <Loader2 className="h-4 w-4 animate-spin mr-1" />
        <span className="text-sm">Processing</span>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex items-center text-red-500">
        <AlertTriangle className="h-4 w-4 mr-1" />
        <span className="text-sm">Failed</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-green-500">
      <FileCheck className="h-4 w-4 mr-1" />
      <span className="text-sm">Completed</span>
    </div>
  );
};
