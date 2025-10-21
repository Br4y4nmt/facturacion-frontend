import { create } from "zustand";
import * as authService from "@/services/auth.service";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  login: async (email, password) => {
    const { usuario, token } = await authService.login({ email, password });
    localStorage.setItem("token", token);
    set({ user: usuario, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
