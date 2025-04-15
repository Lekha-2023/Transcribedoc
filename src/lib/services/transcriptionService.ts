
import { supabase } from "@/integrations/supabase/client";

export const transcribeAudio = async (audioUrl: string) => {
  try {
    console.log('Calling transcribe edge function with URL:', audioUrl);
    const { data: transcriptionData, error: transcriptionError } = await supabase.functions
      .invoke('transcribe', {
        body: { audioUrl }
      });

    if (transcriptionError) {
      console.error('Transcription error:', transcriptionError);
      throw transcriptionError;
    }
    
    if (!transcriptionData || !transcriptionData.text) {
      throw new Error('No transcription data returned from the service');
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
  email: string,
  getUserFiles: (userId: string) => any[]
): Promise<{ success: boolean; message: string }> => {
  const userFiles = getUserFiles(userId);
  const file = userFiles.find(f => f.id === fileId);
  
  if (!file) {
    return { success: false, message: 'File not found' };
  }
  
  if (file.status !== 'completed') {
    return { success: false, message: 'File processing has not been completed' };
  }
  
  // Simulate email sending
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return { 
    success: true, 
    message: `Results for "${file.originalFileName}" successfully sent to ${email}` 
  };
};
