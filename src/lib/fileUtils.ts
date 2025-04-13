
// This is a file processing service with audio transcription capabilities
// In a real app, this would connect to a backend for audio processing

export interface FileRecord {
  id: string;
  fileName: string;
  originalFileName: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'failed';
  fileType: string;
  fileSize: number;
  transcriptText?: string;
  downloadLinks?: {
    txt?: string;
    doc?: string;
    pdf?: string;
  };
}

const FILES_STORAGE_KEY = 'mediscribe_files';

// Get all files for a user
export const getUserFiles = (userId: string): FileRecord[] => {
  const storedFiles = localStorage.getItem(`${FILES_STORAGE_KEY}_${userId}`);
  return storedFiles ? JSON.parse(storedFiles) : [];
};

// Save files for a user
const saveUserFiles = (userId: string, files: FileRecord[]) => {
  localStorage.setItem(`${FILES_STORAGE_KEY}_${userId}`, JSON.stringify(files));
};

// Upload a file and process it for transcription
export const uploadFile = async (
  file: File, 
  userId: string
): Promise<{ success: boolean; fileRecord?: FileRecord; message?: string }> => {
  // Check if the file is an audio file
  const validAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg'];
  if (!validAudioTypes.includes(file.type)) {
    return { 
      success: false, 
      message: 'Only audio files are accepted (MP3, WAV, OGG)' 
    };
  }

  // Create a new file record
  const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const newFileRecord: FileRecord = {
    id: fileId,
    fileName: fileId,
    originalFileName: file.name,
    uploadDate: new Date().toISOString(),
    status: 'processing',
    fileType: file.type,
    fileSize: file.size
  };

  // Add to user's files
  const userFiles = getUserFiles(userId);
  userFiles.push(newFileRecord);
  saveUserFiles(userId, userFiles);

  try {
    // Process the audio file for direct transcription
    const transcriptionText = await transcribeAudioFile(file);
    
    // Update file record with completed status and transcription
    const updatedFileRecord: FileRecord = {
      ...newFileRecord,
      status: 'completed',
      transcriptText: transcriptionText,
      downloadLinks: {
        txt: `#/download/txt/${fileId}`,
        doc: `#/download/doc/${fileId}`,
        pdf: `#/download/pdf/${fileId}`
      }
    };

    // Update in storage
    const updatedFiles = userFiles.map(f => 
      f.id === fileId ? updatedFileRecord : f
    );
    saveUserFiles(userId, updatedFiles);

    return { 
      success: true, 
      fileRecord: updatedFileRecord 
    };
  } catch (error) {
    // Handle transcription failure
    const failedRecord: FileRecord = {
      ...newFileRecord,
      status: 'failed'
    };
    
    // Update in storage
    const updatedFiles = userFiles.map(f => 
      f.id === fileId ? failedRecord : f
    );
    saveUserFiles(userId, updatedFiles);
    
    return {
      success: false,
      message: 'Transcription failed. Please try again with a clearer audio file.'
    };
  }
};

// Direct audio file transcription - using Web Speech API or browser capabilities
const transcribeAudioFile = async (file: File): Promise<string> => {
  // In a real application, this would use a proper speech-to-text API
  // For this demonstration, we'll extract the raw audio content
  
  // Read the file as an ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const audioContent = new Uint8Array(arrayBuffer);
  
  // Simulate processing time based on file size
  await new Promise(resolve => setTimeout(resolve, file.size / 2000));
  
  // Create a simplistic transcription based on file metadata
  // In a real app, this would use a proper STT service like Google Speech-to-Text, AWS Transcribe, or Whisper
  const fileInfo = `
AUDIO TRANSCRIPTION
==================
File: ${file.name}
Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
Type: ${file.type}
Transcribed: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

CONTENT:
This is the direct transcription of the audio file "${file.name}".
The actual content would be determined by processing the audio data which contains ${audioContent.length} bytes of information.
In a production environment, this would use a proper speech recognition service to accurately convert the speech to text.

For demonstration purposes, we've created this placeholder text.
When implemented with a real transcription service, the exact words spoken in the audio would appear here.
`;

  return fileInfo;
};

// Delete a file
export const deleteFile = (fileId: string, userId: string): boolean => {
  const userFiles = getUserFiles(userId);
  const updatedFiles = userFiles.filter(file => file.id !== fileId);
  
  if (updatedFiles.length === userFiles.length) {
    return false; // File not found
  }
  
  saveUserFiles(userId, updatedFiles);
  return true;
};

// Send results via email (mock function)
export const sendResultsViaEmail = async (
  fileId: string, 
  userId: string, 
  email: string
): Promise<{ success: boolean; message: string }> => {
  const userFiles = getUserFiles(userId);
  const file = userFiles.find(f => f.id === fileId);
  
  if (!file) {
    return { success: false, message: 'File not found' };
  }
  
  if (file.status !== 'completed') {
    return { success: false, message: 'File processing has not been completed' };
  }
  
  // In a real application, this would connect to an email service
  // Here we just simulate success after a short delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return { 
    success: true, 
    message: `Results for "${file.originalFileName}" successfully sent to ${email}` 
  };
};
