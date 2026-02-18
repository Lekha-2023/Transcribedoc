
import { AuthState } from './types';

// Storage keys
export const AUTH_STORAGE_KEY = 'mediscribe_auth';

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

// Save auth state to localStorage
export const saveAuthState = (authState: AuthState) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
};

// Clear all stored auth data
export const clearAuthStorage = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

