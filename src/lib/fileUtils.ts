
// This is a mock file processing service
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

// Upload a file
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

  // Simulate processing delay (1-3 seconds)
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  // Mock transcription (in a real app, this would use a speech-to-text API)
  const mockTranscription = getMockTranscription();
  
  // Update file record with completed status and transcription
  const updatedFileRecord: FileRecord = {
    ...newFileRecord,
    status: 'completed',
    transcriptText: mockTranscription,
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

// Mock function to generate fake medical transcription text
const getMockTranscription = (): string => {
  const transcripts = [
    "Patient presents with symptoms of seasonal allergies including sneezing, runny nose, and itchy eyes. Recommended treatment includes over-the-counter antihistamines and avoiding known allergens. Follow-up in two weeks if symptoms persist.",
    
    "Patient is a 45-year-old male with history of hypertension. Blood pressure today is 142/88. Continued on current medication regimen with addition of lifestyle modifications including reduced sodium intake and increased physical activity. Schedule follow-up in one month.",
    
    "Post-operative evaluation shows good healing of surgical site. Patient reports pain level at 2/10, down from 6/10 last week. Continue current pain management protocol and physical therapy. Next appointment scheduled for two weeks.",
    
    "Patient is a 62-year-old female presenting for annual physical examination. All vital signs within normal limits. Routine bloodwork ordered including CBC, comprehensive metabolic panel, and lipid profile. Recommended age-appropriate cancer screenings.",
    
    "Telehealth follow-up for management of Type 2 Diabetes. Patient reports blood glucose readings ranging from 110-145 mg/dL. A1C improved from 7.4% to 6.9%. Continue current medication regimen and dietary plan. Schedule in-person follow-up in three months."
  ];
  
  return transcripts[Math.floor(Math.random() * transcripts.length)];
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
