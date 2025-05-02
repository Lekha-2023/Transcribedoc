import { FileRecord } from "./types/file";
import { getUserFiles, saveUserFiles } from "./storage/localStorageManager";
import { uploadToStorage, deleteFromStorage } from "./storage/fileStorage";
import { transcribeAudio, sendResultsViaEmail as sendResults } from "./services/transcription";
import { supabase } from "@/integrations/supabase/client";

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

  // Check if user is authenticated with Supabase
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    return {
      success: false,
      message: 'Supabase authentication required. Please log in again.'
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
      transcriptText: transcriptionData.text
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
    
    let errorMessage = 'File processing failed. Please try again.';
    
    if (error instanceof Error) {
      if (error.message.includes('row-level security policy')) {
        errorMessage = 'Permission denied: Cannot upload file due to security policy. Please log out and log in again.';
      } else if (error.message.includes('bucket not found') || error.message.includes('Bucket not found')) {
        errorMessage = 'Storage configuration issue: Please contact support.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
    }
    
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

// New function for bulk uploads
export const uploadFiles = async (
  files: File[],
  userId: string
): Promise<Array<{ success: boolean; fileId?: string; message?: string }>> => {
  const results = [];
  
  for (const file of files) {
    try {
      const result = await uploadFile(file, userId);
      results.push({
        success: result.success,
        fileId: result.fileRecord?.id,
        message: result.message
      });
    } catch (error) {
      console.error("Error uploading file:", file.name, error);
      results.push({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
  
  return results;
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
  sendResults(fileId, userId, email);
