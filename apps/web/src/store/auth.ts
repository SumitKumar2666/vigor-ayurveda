import { create } from 'zustand';
import api, { setAccessToken } from '../lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAccessToken(data.accessToken);
      set({ user: data.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  register: async (userData) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/register', userData);
      setAccessToken(data.accessToken);
      set({ user: data.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  logout: async () => {
    await api.post('/auth/logout');
    setAccessToken(null);
    set({ user: null });
  },
  checkAuth: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data });
    } catch (error) {
      set({ user: null });
    }
  },
}));