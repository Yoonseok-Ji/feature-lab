import { create } from 'zustand';

function parseUserId(token: string | null): number | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return parseInt(payload.sub, 10);
  } catch {
    return null;
  }
}

interface AuthState {
  token: string | null;
  userId: number | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('access_token'),
  userId: parseUserId(localStorage.getItem('access_token')),
  setToken: (token) => {
    localStorage.setItem('access_token', token);
    set({ token, userId: parseUserId(token) });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    set({ token: null, userId: null });
  },
}));
