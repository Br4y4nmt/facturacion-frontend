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
  const response = await api.post("/auth/logout");
  return response.data;
};

/**
 * 🧩 Obtiene el perfil del usuario autenticado
 * (usando la cookie httpOnly)
 */
export const getProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
