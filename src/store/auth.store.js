import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authService from "@/services/auth.service";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      // este flag es SOLO para la verificación inicial de sesión (/auth/me)
      checking: true,

      // LOGIN (no tocar 'checking' aquí)
      login: async ({ email, password }) => {
        try {
          const { usuario } = await authService.login({ email, password });
          set({ user: usuario, isAuthenticated: true });
          return usuario;
        } catch (error) {
          // no cambies 'checking' y evita desmontar la app
          set({ isAuthenticated: false });
          throw error;
        }
      },

      // LOGOUT
      logout: async () => {
        try { await authService.logout(); } catch {}
        set({ user: null, isAuthenticated: false, checking: false });
        localStorage.clear();
      },

      // CHECK SESSION via /me
      checkAuth: async () => {
        set({ checking: true });
        try {
          const data = await authService.getProfile();
          if (data?.usuario) {
            set({ user: data.usuario, isAuthenticated: true, checking: false });
            return true;
          } else {
            set({ user: null, isAuthenticated: false, checking: false });
            return false;
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false, checking: false });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
