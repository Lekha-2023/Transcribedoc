
import { AuthState } from './types';

// Storage keys
export const USERS_STORAGE_KEY = 'mediscribe_users';
export const AUTH_STORAGE_KEY = 'mediscribe_auth';

// Get all registered users
export const getUsers = (): Record<string, { name: string; email: string; password: string }> => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  return storedUsers ? JSON.parse(storedUsers) : {};
};

// Save users to localStorage
export const saveUsers = (users: Record<string, { name: string; email: string; password: string }>) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

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
  localStorage.removeItem(USERS_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

