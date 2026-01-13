import api from "@/services/api";
const BASE_URL = "/usuarios";

/**
 * Obtener todos los usuarios (solo superadmin)
 */
export const getUsuarios = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

/**
 * Obtener usuarios por empresa
 */
export const getUsuariosByEmpresa = async (empresaId, params = {}) => {
  const response = await api.get(`${BASE_URL}/empresa/${empresaId}`, { params });
  return response.data;
};

/**
 * Obtener un usuario por ID
 */
export const getUsuarioById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Crear un nuevo usuario
 */
export const createUsuario = async (data) => {
  console.log("[usuarios.service] createUsuario - datos enviados:", data);
  const response = await api.post(`${BASE_URL}/register`, data);
  console.log("[usuarios.service] createUsuario - respuesta:", response.data);
  return response.data;
};

/**
 * Actualizar un usuario
 */
export const updateUsuario = async (id, data) => {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

/**
 * Eliminar un usuario
 */
export const deleteUsuario = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Cambiar estado de usuario (activar/desactivar)
 */
export const toggleUsuarioStatus = async (id) => {
  const response = await api.patch(`${BASE_URL}/${id}/estado`);
  return response.data;
};

/**
 * Resetear contraseña de usuario
 */
export const resetPassword = async (id) => {
  const response = await api.post(`${BASE_URL}/${id}/reset-password`);
  return response.data;
};

/**
 * Cambiar contraseña
 */
export const changePassword = async (id, data) => {
  const response = await api.post(`${BASE_URL}/${id}/change-password`, data);
  return response.data;
};

/**
 * Obtener roles disponibles
 */
export const getRoles = async () => {
  const response = await api.get(`${BASE_URL}/roles`);
  return response.data;
};

export default {
  getUsuarios,
  getUsuariosByEmpresa,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  toggleUsuarioStatus,
  resetPassword,
  changePassword,
  getRoles,
};
