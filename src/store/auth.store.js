import { create } from "zustand";
import * as authService from "@/services/auth.service";

// 🔹 Store global para manejo de autenticación
export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),

  // 🔹 Login
  login: async (email, password) => {
    const { usuario, token } = await authService.login({ email, password });

    // Guardar en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(usuario));

    // Actualizar el estado global
    set({ user: usuario, token, isAuthenticated: true });

    return usuario; // lo devolvemos para redirección dinámica
  },

  // 🔹 Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
