import { create } from "zustand";
import * as authService from "@/services/auth.service";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true, 

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const { usuario } = await authService.login({ email, password });

      set({
        user: usuario,
        isAuthenticated: true,
        loading: false,
      });

      return usuario;
    } catch (error) {
      console.error("❌ Error en login:", error);
      set({ isAuthenticated: false, loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn("⚠️ Error al cerrar sesión:", error);
    }

    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    });

    localStorage.clear();
    sessionStorage.clear();
  },


 checkAuth: async () => {
  if (window.location.pathname === "/login") {
    // No hacemos nada en la pantalla de login
    set({ loading: false });
    return false;
  }

  set({ loading: true });
  try {
    const data = await authService.getProfile();
    if (!data || (!data.usuario && !data.rolId)) {
      set({ user: null, isAuthenticated: false, loading: false });
      return false;
    }

    set({ user: data.usuario || data, isAuthenticated: true, loading: false });
    return true;
  } catch (error) {
    const status = error?.response?.status;
    if (status && status !== 401) {
      console.error("❌ Error verificando sesión:", error.response?.data || error.message);
    }
    set({ user: null, isAuthenticated: false, loading: false });
    return false;
  }
},



}));
