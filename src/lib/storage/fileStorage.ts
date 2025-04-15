
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
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio-files')
      .upload(`${userId}/${fileId}`, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('audio-files')
      .getPublicUrl(`${userId}/${fileId}`);

    return publicUrl;
  } catch (error) {
    console.error('Upload to storage failed:', error);
    throw error;
  }
};

export const deleteFromStorage = async (userId: string, fileId: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from('audio-files')
      .remove([`${userId}/${fileId}`]);

    if (error) {
      console.error('Storage delete error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Delete from storage failed:', error);
    throw error;
  }
};
