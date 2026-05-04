import { supabase } from "@/integrations/supabase/client";
import { User, AuthState } from './types';
import { saveAuthState, getInitialAuthState } from './storage';

// Register a new user
export const registerUser = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
  try {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name
        }
      }
    });
    
    if (error) {
      console.error("Registration error:", error);
      return { 
        success: false, 
        message: error.message 
      };
    }
    
    // Check if user already exists (Supabase returns user but no session)
    if (data.user && !data.session) {
      return { 
        success: true, 
        message: 'Check your email for the confirmation link.' 
      };
    }
    
    return { success: true, message: 'Registration successful' };
  } catch (error) {
    console.error("Registration error:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Registration failed' 
    };
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User; token?: string }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: error.message 
      };
    }
    
    const user: User = {
      id: data.user.id,
      name: data.user.user_metadata?.name || email.split('@')[0],
      email: data.user.email || email
    };
    
    const authState: AuthState = {
      isAuthenticated: true,
      user,
    };
    
    saveAuthState(authState);
    
    return { 
      success: true, 
      message: 'Login successful',
      user,
      token: data.session?.access_token
    };
  } catch (error) {
    console.error("Login error:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Invalid login credentials' 
    };
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
  }
  
  const emptyState: AuthState = {
    isAuthenticated: false,
    user: null,
  };
  
  saveAuthState(emptyState);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const authState = getInitialAuthState();
  return authState.isAuthenticated && !!authState.user;
};

// Get current user
export const getCurrentUser = (): User | null => {
  const authState = getInitialAuthState();
  return authState.user;
};
