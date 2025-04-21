
import { supabase } from "@/integrations/supabase/client";
import { readFileAsArrayBuffer, arrayBufferToBase64 } from "./transcriptionFileUtils";

/**
 * Handles demo audio transcription including strict validation & progress.
 */
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
    
    // Get audio as raw binary data
    const fileBuffer = await readFileAsArrayBuffer(audioFile);
    
    // Extract file extension properly
    const fileExt = audioFile.name.split('.').pop()?.toLowerCase() || '';
    
    // Convert audio buffer directly to base64
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
