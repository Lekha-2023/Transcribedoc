
import { FileRecord } from "@/lib/types/file";

export const downloadTranscription = async (file: FileRecord): Promise<void> => {
  if (!file.transcriptText) {
    throw new Error("No transcription available for this file");
  }

  // Create text blob for download
  const blob = new Blob([file.transcriptText], { type: "text/plain" });
  
  // Create filename based on original filename
  const originalName = file.originalFileName || "transcription";
  const baseFilename = originalName.split('.').slice(0, -1).join('.') || originalName;
  const filename = `${baseFilename}_transcription.txt`;
  
  // Create download link and trigger it
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};
