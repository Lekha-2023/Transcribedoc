
import { supabase } from "@/integrations/supabase/client";

export const uploadToStorage = async (file: File, userId: string, fileId: string) => {
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('audio-files')
    .upload(`${userId}/${fileId}`, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('audio-files')
    .getPublicUrl(`${userId}/${fileId}`);

  return publicUrl;
};

export const deleteFromStorage = async (userId: string, fileId: string): Promise<void> => {
  const { error } = await supabase.storage
    .from('audio-files')
    .remove([`${userId}/${fileId}`]);

  if (error) throw error;
};
