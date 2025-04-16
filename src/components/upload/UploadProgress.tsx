
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  uploadProgress: number;
  onUpload: () => void;
  isUploading: boolean;
}

const UploadProgress = ({ uploadProgress, onUpload, isUploading }: UploadProgressProps) => {
  return (
    <>
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
          onClick={onUpload}
          className="bg-medical-teal hover:bg-medical-teal/90 text-white"
        >
          Upload & Transcribe
        </Button>
      )}
    </>
  );
};

export default UploadProgress;
