import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authService from "@/services/auth.service";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,

      // LOGIN
      login: async ({ email, password }) => {
        set({ loading: true });
        try {
          const { usuario } = await authService.login({ email, password });
          set({ user: usuario, isAuthenticated: true, loading: false });
          return usuario;
        } catch (error) {
          console.error("❌ Error en login:", error);
          set({ isAuthenticated: false, loading: false });
          throw error;
        }
      },

      // LOGOUT
      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.warn("⚠️ Error al cerrar sesión:", error);
        }
        set({ user: null, isAuthenticated: false, loading: false });
        localStorage.clear();
      },

      // CHECK SESSION via /me
      checkAuth: async () => {
        set({ loading: true });
        try {
          const data = await authService.getProfile();
          if (data?.usuario) {
            set({ user: data.usuario, isAuthenticated: true, loading: false });
            return true;
          } else {
            set({ user: null, isAuthenticated: false, loading: false });
            return false;
          }
        } catch (error) {
          console.error("❌ Sesión inválida:", error.message);
          set({ user: null, isAuthenticated: false, loading: false });
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
