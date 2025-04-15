
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a file to Supabase storage
 * @param file The file to upload
 * @param userId The user ID
 * @param fileId The unique file ID
 * @returns The public URL of the uploaded file
 */
export const uploadToStorage = async (file: File, userId: string, fileId: string) => {
  try {
    // Create a folder path with the userId to enforce RLS
    const filePath = `${userId}/${fileId}`;
    console.log(`Uploading file to path: ${filePath}`);
    
    // Ensure the user is authenticated before uploading
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error('Authentication check failed: No valid session found');
      throw new Error('User is not authenticated');
    }
    
    console.log('Authentication successful, proceeding with upload');
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Allow updating existing files
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    console.log('Upload successful:', uploadData);

    const { data: { publicUrl } } = supabase.storage
      .from('audio-files')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Upload to storage failed:', error);
    throw error;
  }
};

export const deleteFromStorage = async (userId: string, fileId: string): Promise<void> => {
  try {
    // Use the proper folder structure with userId
    const filePath = `${userId}/${fileId}`;
    
    const { error } = await supabase.storage
      .from('audio-files')
      .remove([filePath]);

    if (error) {
      console.error('Storage delete error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Delete from storage failed:', error);
    throw error;
  }
};
