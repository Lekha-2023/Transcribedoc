
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

export const NoFiles = () => {
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
};
