import { create } from "zustand";
import { User } from "@/types/api";
import { getToken, setToken, removeToken, getUser, setUser } from "@/lib/auth";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (token: string, user: User) => {
    setToken(token);
    setUser(user);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    removeToken();
    set({ user: null, isAuthenticated: false });
  },

  initializeAuth: () => {
    const token = getToken();
    const user = getUser();
    if (token && user) {
      set({ user, isAuthenticated: true });
    }
  },
}));
