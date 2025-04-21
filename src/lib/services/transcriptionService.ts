
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
