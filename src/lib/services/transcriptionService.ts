
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

// Fixed audio file handling for demo transcription
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
    
    // Read file as ArrayBuffer first
    const fileArrayBuffer = await readFileAsArrayBuffer(audioFile);
    
    // Create a proper binary Blob with correct MIME type
    const audioBlob = new Blob([fileArrayBuffer], { type: fileType });
    console.log('Created audio blob:', audioBlob.size, 'bytes, type:', audioBlob.type);
    
    // Convert blob to base64 string
    const base64Data = await blobToBase64(audioBlob);
    console.log('Converted to base64, length:', base64Data.length);
    
    if (!base64Data || base64Data.length === 0) {
      throw new Error('Failed to convert audio file to base64');
    }
    
    // Get file extension - more important than MIME type for some backends
    const fileExt = audioFile.name.split('.').pop()?.toLowerCase() || '';
    console.log('File extension:', fileExt);
    
    console.log('Sending audio data to transcribe function...');
    
    // Call the edge function with the proper data format
    const { data, error } = await supabase.functions.invoke('transcribe', {
      body: { 
        audioBase64: base64Data,
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
    
    console.log('Demo transcription response:', data);
    
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

// Helper function to convert Blob to base64
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
