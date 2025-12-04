import { supabase } from "@/integrations/supabase/client";
import { User, AuthState } from './types';
import { getUsers, saveUsers, saveAuthState, getInitialAuthState } from './storage';

// Register a new user
export const registerUser = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
  const users = getUsers();
  
  // Check if email already exists
  if (users[email]) {
    return { success: false, message: 'Email already registered' };
  }
  
  try {
    const redirectUrl = `${window.location.origin}/`;
    
    // Register with Supabase
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
      throw error;
    }
    
    // Create new user in local storage
    users[email] = {
      name,
      email,
      password
    };
    
    saveUsers(users);
    
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
    console.log("Attempting login with:", { email, password });
    
    // Log in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Login error:", error);
      throw error;
    }
    
    console.log("Supabase login response:", data);
    
    const users = getUsers();
    
    // Check if user exists in local storage
    if (!users[email]) {
      // Create user in local storage if not exists (might be created through Supabase directly)
      users[email] = {
        name: data.user?.user_metadata?.name || email.split('@')[0],
        email,
        password
      };
      saveUsers(users);
    }
    
    // Generate a token
    const token = data.session?.access_token || `mock-jwt-token-${Date.now()}`;
    
    const user: User = {
      id: data.user?.id || email,
      name: users[email].name,
      email
    };
    
    // Save auth state
    const authState: AuthState = {
      isAuthenticated: true,
      user,
      token
    };
    
    saveAuthState(authState);
    
    return { 
      success: true, 
      message: 'Login successful',
      user,
      token
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
    // Sign out from Supabase
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Supabase logout error:", error);
  }
  
  // Clear local auth state regardless of Supabase result
  const emptyState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null
  };
  
  saveAuthState(emptyState);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const authState = getInitialAuthState();
  return authState.isAuthenticated && !!authState.token;
};

// Get current user
export const getCurrentUser = (): User | null => {
  const authState = getInitialAuthState();
  return authState.user;
};
