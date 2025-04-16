// This is a mock authentication service that simulates login/registration
// In a real application, this would connect to a backend service

import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Mock user storage - in a real app, this would be handled by a backend
const USERS_STORAGE_KEY = 'mediscribe_users';
const AUTH_STORAGE_KEY = 'mediscribe_auth';

// Initialize the auth state from localStorage
export const getInitialAuthState = (): AuthState => {
  const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
  if (storedAuth) {
    return JSON.parse(storedAuth);
  }
  return {
    isAuthenticated: false,
    user: null,
    token: null
  };
};

// Get all registered users
const getUsers = (): Record<string, { name: string; email: string; password: string }> => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  return storedUsers ? JSON.parse(storedUsers) : {};
};

// Save users to localStorage
const saveUsers = (users: Record<string, { name: string; email: string; password: string }>) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Save auth state to localStorage
const saveAuthState = (authState: AuthState) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
};

// Clear all stored auth data
export const clearAllAuthData = () => {
  // Clear local storage keys
  localStorage.removeItem(USERS_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
  
  // Sign out from Supabase
  supabase.auth.signOut();
};

// Register a new user
export const registerUser = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
  const users = getUsers();
  
  // Check if email already exists
  if (users[email]) {
    return { success: false, message: 'Email already registered' };
  }
  
  try {
    // Register with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
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

// Send password reset email
export const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if the email exists
    const users = getUsers();
    if (!users[email]) {
      return { success: false, message: 'Email not found' };
    }
    
    // Send password reset email via Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
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
export const updatePassword = async (password: string, token?: string): Promise<{ success: boolean; message: string }> => {
  try {
    if (!token) {
      throw new Error("Reset token is required");
    }

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
