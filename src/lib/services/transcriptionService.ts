
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

// Demo transcription function with improved error handling
export const transcribeDemoAudio = async (audioFile: File): Promise<{ text: string }> => {
  try {
    console.log('Starting demo transcription for file:', audioFile.name, 'type:', audioFile.type, 'size:', audioFile.size);
    
    // Validate file type
    if (!audioFile.type.startsWith('audio/')) {
      throw new Error('Invalid file type. Please select an audio file.');
    }
    
    // Check if file is too large (over 15MB)
    if (audioFile.size > 15 * 1024 * 1024) {
      throw new Error('File is too large. Maximum size is 15MB.');
    }
    
    // Convert the file to base64 for direct transmission
    const base64Audio = await fileToBase64(audioFile);
    console.log('File converted to base64, length:', base64Audio.length, 'calling transcribe edge function...');
    
    // Call the edge function directly with the base64 data
    const { data, error } = await supabase.functions.invoke('transcribe', {
      body: { 
        audioBase64: base64Audio,
        fileName: audioFile.name,
        isDemo: true
      }
    });
    
    if (error) {
      console.error('Demo transcription error from edge function:', error);
      throw new Error(`Edge Function error: ${error.message || JSON.stringify(error)}`);
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

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:audio/wav;base64,")
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

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
