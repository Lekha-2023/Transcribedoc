// This is a file processing service with audio transcription capabilities
// Uses Web Speech API for speech-to-text conversion

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
    // Process the audio file for real transcription
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
    console.error('Transcription error:', error);
    
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

// Audio file transcription using Web Speech API
const transcribeAudioFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      reject('Speech recognition not supported in this browser');
      return;
    }
    
    // Convert the file to an audio element for playing
    const audioURL = URL.createObjectURL(file);
    const audio = new Audio(audioURL);
    
    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    let transcript = '';
    
    // Handle recognition results
    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript + ' ';
        }
      }
    };
    
    // Handle errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      reject(`Speech recognition error: ${event.error}`);
    };
    
    // Handle end of recognition
    recognition.onend = () => {
      if (transcript.trim()) {
        // Add metadata to the transcript
        const result = `
AUDIO TRANSCRIPTION
==================
File: ${file.name}
Size: ${(file.fileSize / 1024 / 1024).toFixed(2) || (file.size / 1024 / 1024).toFixed(2)} MB
Type: ${file.type}
Transcribed: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

CONTENT:
${transcript.trim()}
`;
        resolve(result);
      } else {
        reject('No speech was recognized. Please try again with a clearer audio file.');
      }
    };
    
    // Start recognition when audio starts playing
    audio.onplay = () => {
      recognition.start();
    };
    
    // Stop recognition when audio ends
    audio.onended = () => {
      recognition.stop();
    };
    
    // Start playing the audio
    audio.play().catch(err => {
      console.error('Error playing audio:', err);
      reject(`Error playing audio: ${err.message}`);
    });
  });
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

// Type definition for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
