
// Types for authentication

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

