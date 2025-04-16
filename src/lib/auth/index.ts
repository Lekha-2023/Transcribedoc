
import { clearAuthStorage } from './storage';
import { supabase } from "@/integrations/supabase/client";

// Re-export everything from the modules
export * from './storage';
export * from './types';
export * from './userAuth';
export * from './passwordReset';

// Clear all stored auth data
export const clearAllAuthData = () => {
  // Clear local storage keys
  clearAuthStorage();
  
  // Sign out from Supabase
  supabase.auth.signOut();
};

