
import { supabase } from "@/integrations/supabase/client";

export const transcribeAudio = async (audioUrl: string) => {
  try {
    console.log('Calling transcribe edge function with URL:', audioUrl);
    
    if (!audioUrl) {
      throw new Error('Audio URL is required');
    }
    
    const { data: transcriptionData, error: transcriptionError } = await supabase.functions
      .invoke('transcribe', {
        body: { audioUrl }
      });

    if (transcriptionError) {
      console.error('Transcription error from edge function:', transcriptionError);
      throw transcriptionError;
    }
    
    console.log('Raw transcription response:', transcriptionData);
    
    if (!transcriptionData) {
      throw new Error('No data returned from transcription service');
    }
    
    if (!transcriptionData.text) {
      throw new Error('No transcription text found in response');
    }
    
    return transcriptionData;
  } catch (error) {
    console.error('Transcription service error:', error);
    throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Demo transcription with improved audio handling
export const transcribeDemoAudio = async (audioFile: File): Promise<{ text: string }> => {
  try {
    console.log('Starting demo transcription for file:', audioFile.name, 'type:', audioFile.type, 'size:', audioFile.size);
    
    // Validate file type more strictly
    const validAudioTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'];
    const fileType = audioFile.type;
    
    if (!validAudioTypes.includes(fileType)) {
      throw new Error(`Invalid file type: ${fileType}. Please select a valid audio file (MP3, WAV, OGG, WEBM).`);
    }
    
    // Check if file is too large (over 15MB)
    if (audioFile.size > 15 * 1024 * 1024) {
      throw new Error('File is too large. Maximum size is 15MB.');
    }
    
    // Check if file is empty
    if (audioFile.size === 0) {
      throw new Error('File appears to be empty. Please select a valid audio file.');
    }
    
    // CRITICAL FIX: Get audio as raw binary data, not as ArrayBuffer
    const fileBuffer = await readFileAsArrayBuffer(audioFile);
    
    // Extract file extension properly
    const fileExt = audioFile.name.split('.').pop()?.toLowerCase() || '';
    
    // Convert audio buffer directly to base64 without creating a blob
    // This avoids potential format conversion issues
    const base64String = arrayBufferToBase64(fileBuffer);
    
    console.log('File converted to base64, length:', base64String.length);
    console.log('File extension:', fileExt);
    console.log('File MIME type:', fileType);
    
    // Call the edge function with properly formatted data
    const { data, error } = await supabase.functions.invoke('transcribe', {
      body: { 
        audioBase64: base64String,
        fileName: audioFile.name,
        isDemo: true,
        fileType: fileType,
        fileExt: fileExt
      }
    });
    
    if (error) {
      console.error('Demo transcription error:', error);
      throw new Error(`Edge Function error: ${error.message || 'Unknown error'}`);
    }
    
    if (!data) {
      throw new Error('No data returned from transcription service');
    }
    
    if (data.error) {
      throw new Error(`Service error: ${data.error}`);
    }
    
    if (!data.text) {
      throw new Error('No transcription text found in response');
    }
    
    return data;
  } catch (error) {
    console.error('Demo transcription error:', error);
    throw new Error(`Demo transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function to read file as ArrayBuffer 
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
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

// IMPROVED: Direct conversion of ArrayBuffer to base64 without Blob
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Legacy blobToBase64 helper - kept for reference
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Extract only the base64 data part (remove the data URL prefix)
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
};

// Legacy method kept for compatibility
export const sendResultsViaEmail = async (
  fileId: string, 
  userId: string, 
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get the file data from our local storage
    const { getUserFiles } = await import('@/lib/storage/localStorageManager');
    const userFiles = getUserFiles(userId);
    const file = userFiles.find(f => f.id === fileId);
    
    if (!file) {
      return { success: false, message: 'File not found' };
    }
    
    if (file.status !== 'completed') {
      return { success: false, message: 'File processing has not been completed' };
    }

    console.log('Sending transcription email for file:', fileId);
    console.log('Email:', email);
    console.log('Transcription text:', file.transcriptText);
    
    // Make sure we have transcription text
    if (!file.transcriptText) {
      return { success: false, message: 'No transcription text available for this file' };
    }
    
    const { data, error } = await supabase.functions.invoke('send-contact-confirmation', {
      body: { 
        name: email.split('@')[0],
        email: email,
        subject: `Your Transcription: ${file.originalFileName}`,
        transcription: file.transcriptText
      }
    });

    if (error) {
      console.error('Error invoking function:', error);
      throw error;
    }

    console.log('Email send response:', data);

    return { 
      success: true, 
      message: `Results for "${file.originalFileName}" successfully sent to ${email}` 
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      message: 'Failed to send email. Please try again later.' 
    };
  }
};
