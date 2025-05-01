
import { FileRecord } from "@/lib/types/file";

/**
 * Converts a File object to a base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:audio/mp3;base64,")
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

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
