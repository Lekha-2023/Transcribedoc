
/**
 * File reading/conversion helpers for transcription logic.
 */

// Helper function to read file as ArrayBuffer 
export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as ArrayBuffer'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Convert ArrayBuffer to base64 string (without data URL prefix)
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Read file and convert to base64 in one step
export const fileToBase64 = async (file: File): Promise<string> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  return arrayBufferToBase64(arrayBuffer);
};
