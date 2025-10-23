import api from "./api";

/**
 * 🔐 Login - envía email y password al backend
 */
export const login = async ({ email, password }) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

/**
 * 🚪 Logout - borra cookie httpOnly en el backend
 */
export const logout = async () => {
  try {
    // Primero limpiar el estado local
    localStorage.clear();
    sessionStorage.clear();
    
    try {
      // Intentar hacer logout en el backend
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      // Si falla el backend (404 u otro error), solo registramos el error
      // pero consideramos el logout exitoso ya que limpiamos el estado local
      console.warn("Error en logout del backend:", error);
      return { success: true, message: "Sesión cerrada localmente" };
    }
  } catch (error) {
    console.error("Error crítico en logout:", error);
    throw error;
  }
};

/**
 * 🧩 Obtiene el perfil del usuario autenticado
 * (usando la cookie httpOnly)
 */
export const getProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
