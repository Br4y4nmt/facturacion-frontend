import { create } from "zustand";
import * as authService from "@/services/auth.service";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true, // indica si está verificando la sesión o logueando

  /**
   * 🔐 Login con cookies httpOnly
   * Envía las credenciales al backend y guarda el usuario autenticado
   */
  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      // 👉 Llamada al backend (usa httpOnly cookie)
      const { usuario } = await authService.login({ email, password });

      // ✅ Guardar usuario en estado global
      set({
        user: usuario,
        isAuthenticated: true,
        loading: false,
      });

      return usuario;
    } catch (error) {
      console.error("❌ Error en login:", error);
      set({ loading: false, isAuthenticated: false });
      throw error;
    }
  },

  /**
   * 🚪 Logout
   * Limpia sesión y borra cookie httpOnly en el backend
   */
  logout: async () => {
    try {
      console.log("Iniciando proceso de logout...");
      // Marcar que estamos en proceso de logout
      sessionStorage.setItem('logging_out', 'true');
      
      // Limpiar estado inmediatamente
      set({
        user: null,
        isAuthenticated: false,
        loading: false
      });
      
      // Llamar al backend para logout
      const result = await authService.logout();
      console.log("Logout completado:", result);
      
      return true;
    } catch (error) {
      console.warn("⚠️ Error en proceso de logout:", error);
      // Asegurarse de que el estado esté limpio
      set({
        user: null,
        isAuthenticated: false,
        loading: false
      });
      // No lanzar el error, ya que el logout del frontend fue exitoso
      return true;
    }
  },

  /**
   * 🔄 checkSession()
   * Verifica si hay una sesión activa desde la cookie httpOnly
   * Llamado automáticamente al iniciar la app
   */
checkSession: async () => {
  set({ loading: true });

  try {
    const data = await authService.getProfile();
    
    // Verificar que tenemos los datos necesarios
    if (!data || (!data.usuario && !data.rolId)) {
      console.log("Sesión inválida - datos incompletos");
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
      return false;
    }

    // Actualizar estado con los datos del usuario
    set({
      user: data.usuario || data,
      isAuthenticated: true,
      loading: false,
    });
    return true;
  } catch (error) {
    // ⚠️ Si el backend devuelve 401, no mostrarlo en consola
    if (error?.response?.status !== 401) {
      console.error("Error verificando sesión:", error);
    }

    // Limpiar estado
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    });

    // Limpiar cualquier estado residual
    localStorage.clear();
    sessionStorage.clear();
    
    return false;
  }
},
}));
