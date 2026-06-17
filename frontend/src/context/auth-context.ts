import { createContext } from 'react';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readStoredUser(): User | null {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export function getInitialAuthState(): Pick<AuthContextType, 'user' | 'token' | 'loading'> {
  const token = localStorage.getItem('token');
  const user = readStoredUser();

  if (user && token) {
    return { user, token, loading: false };
  }

  localStorage.removeItem('token');
  localStorage.removeItem('user');

  return { user: null, token: null, loading: false };
}
