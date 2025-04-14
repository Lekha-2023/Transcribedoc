
import { supabase } from "@/integrations/supabase/client";

export const transcribeAudio = async (audioUrl: string) => {
  const { data: transcriptionData, error: transcriptionError } = await supabase.functions
    .invoke('transcribe', {
      body: { audioUrl }
    });

  if (transcriptionError) throw transcriptionError;
  return transcriptionData;
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
