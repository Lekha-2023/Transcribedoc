
import { supabase } from "@/integrations/supabase/client";
import { getUsers } from './storage';

// Send password reset email
export const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if the email exists
    const users = getUsers();
    if (!users[email]) {
      return { success: false, message: 'Email not found' };
    }
    
    // Get the current origin (domain)
    const origin = window.location.origin;
    
    // Send password reset email via Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    });
    
    if (error) {
      console.error("Password reset error:", error);
      throw error;
    }
    
    return { 
      success: true, 
      message: 'Password reset instructions sent to your email' 
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to send reset instructions' 
    };
  }
};

// Update password (for reset password flow)
export const updatePassword = async (password: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error("Update password error:", error);
      throw error;
    }

    return { 
      success: true, 
      message: 'Password updated successfully' 
    };
  } catch (error) {
    console.error("Update password error:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update password' 
    };
  }
};

