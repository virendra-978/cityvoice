import { create } from 'zustand';
import { login as loginApi, register as registerApi, LoginData, RegisterData, AuthResponse } from '../services/auth';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isAdmin: false,

  login: async (data) => {
    try {
      const response = await loginApi(data);
      handleAuthSuccess(response, set);
    } catch (error) {
      throw error;
    }
  },

  register: async (data) => {
    try {
      const response = await registerApi(data);
      handleAuthSuccess(response, set);
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  },
}));

function handleAuthSuccess(response: AuthResponse, set: any) {
  const { token, user } = response;
  localStorage.setItem('token', token);
  set({
    user,
    token,
    isAuthenticated: true,
    isAdmin: user.role === 'admin',
  });
}

export default useAuthStore;