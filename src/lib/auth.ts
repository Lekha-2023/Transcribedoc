
// This is a mock authentication service that simulates login/registration
// In a real application, this would connect to a backend service

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

// Register a new user
export const registerUser = (name: string, email: string, password: string): { success: boolean; message: string } => {
  const users = getUsers();
  
  // Check if email already exists
  if (users[email]) {
    return { success: false, message: 'Email already registered' };
  }
  
  // Create new user
  users[email] = {
    name,
    email,
    // In a real app, this password would be hashed using bcrypt or similar
    password
  };
  
  saveUsers(users);
  
  return { success: true, message: 'Registration successful' };
};

// Login user
export const loginUser = (email: string, password: string): { success: boolean; message: string; user?: User; token?: string } => {
  const users = getUsers();
  
  // Check if user exists
  if (!users[email]) {
    return { success: false, message: 'User not found' };
  }
  
  // Check password
  if (users[email].password !== password) {
    return { success: false, message: 'Invalid password' };
  }
  
  // Generate a mock JWT token (in a real app, this would be a proper JWT)
  const token = `mock-jwt-token-${Date.now()}`;
  
  const user: User = {
    id: email,
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
};

// Logout user
export const logoutUser = (): void => {
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
