
export const SUPPORTED_AUDIO_TYPES = {
  "audio/mp3": "mp3",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/ogg": "ogg",
  "audio/webm": "webm"
};

export const getFileTypeErrorMsg = (file: File): string | null => {
  if (!file) return "No file selected";
  
  if (file.size === 0) {
    return "The selected file appears to be empty. Please provide a valid audio file (MP3, WAV, OGG, WEBM)";
  }
  
  // More strictly validate audio MIME types
  const validTypes = Object.keys(SUPPORTED_AUDIO_TYPES);
  if (!validTypes.includes(file.type)) {
    // Check file extension as fallback
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !['mp3', 'wav', 'ogg', 'webm'].includes(fileExt)) {
      return `Unsupported audio type: "${file.type || "unknown"}" with extension ".${fileExt || "unknown"}". Please select: MP3, WAV, OGG, or WEBM only.`;
    }
    console.warn(`File MIME type "${file.type}" not recognized, but extension ".${fileExt}" is valid.`);
  }
  
  if (file.size > 15 * 1024 * 1024) {
    return "File too large. Maximum allowed size is 15MB.";
  }
  
  return null;
};
