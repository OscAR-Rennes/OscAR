import { create } from "zustand";
import { UserSessionDTO } from "../../api/models/users/UserSessionDTO";

type AuthState = {
  user: UserSessionDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserSessionDTO) => void;
  clearUser: () => void;
  finishLoading: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({
      user: user ?? null,
      isAuthenticated: !!user,
      isLoading: false,
    })
  },

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  finishLoading: () => set({ isLoading: false }),
}));