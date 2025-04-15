
import { FileRecord } from "./types/file";
import { getUserFiles, saveUserFiles } from "./storage/localStorageManager";
import { uploadToStorage, deleteFromStorage } from "./storage/fileStorage";
import { transcribeAudio, sendResultsViaEmail as sendResults } from "./services/transcriptionService";

export type { FileRecord };
export { getUserFiles };

export const uploadFile = async (
  file: File, 
  userId: string
): Promise<{ success: boolean; fileRecord?: FileRecord; message?: string }> => {
  const validAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/webm'];
  if (!validAudioTypes.includes(file.type)) {
    return { 
      success: false, 
      message: 'Only audio files are accepted (MP3, WAV, OGG, WEBM)' 
    };
  }

  if (!userId) {
    return {
      success: false,
      message: 'User authentication required'
    };
  }

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

  const userFiles = getUserFiles(userId);
  userFiles.push(newFileRecord);
  saveUserFiles(userId, userFiles);

  try {
    console.log('Starting file upload to storage for user:', userId);
    const publicUrl = await uploadToStorage(file, userId, fileId);
    console.log('File uploaded successfully, URL:', publicUrl);
    
    console.log('Starting transcription process...');
    const transcriptionData = await transcribeAudio(publicUrl);
    console.log('Transcription completed:', transcriptionData);

    const updatedFileRecord: FileRecord = {
      ...newFileRecord,
      status: 'completed',
      transcriptText: transcriptionData.text,
      downloadLinks: {
        txt: `#/download/txt/${fileId}`,
        doc: `#/download/doc/${fileId}`,
        pdf: `#/download/pdf/${fileId}`
      }
    };

    const updatedFiles = userFiles.map(f => 
      f.id === fileId ? updatedFileRecord : f
    );
    saveUserFiles(userId, updatedFiles);

    return { 
      success: true, 
      fileRecord: updatedFileRecord 
    };
  } catch (error) {
    console.error('Processing error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'File processing failed. Please try again.';
    
    const failedRecord: FileRecord = {
      ...newFileRecord,
      status: 'failed'
    };
    
    const updatedFiles = userFiles.map(f => 
      f.id === fileId ? failedRecord : f
    );
    saveUserFiles(userId, updatedFiles);
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

export const deleteFile = async (fileId: string, userId: string): Promise<boolean> => {
  const userFiles = getUserFiles(userId);
  const fileToDelete = userFiles.find(file => file.id === fileId);
  
  if (!fileToDelete) {
    return false;
  }
  
  const updatedFiles = userFiles.filter(file => file.id !== fileId);
  
  try {
    await deleteFromStorage(userId, fileId);
    saveUserFiles(userId, updatedFiles);
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};

export const sendResultsViaEmail = (fileId: string, userId: string, email: string) => 
  sendResults(fileId, userId, email, getUserFiles);
