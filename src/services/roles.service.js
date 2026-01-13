import api from "@/services/api";

const BASE_URL = "/roles";

/**
 * Obtener todos los roles con stats
 */
export const getRoles = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

/**
 * Obtener un rol por ID
 */
export const getRolById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Obtener permisos de un rol
 */
export const getRolPermisos = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}/permisos`);
  return response.data;
};

/**
 * Crear un nuevo rol
 */
export const createRol = async (data) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

/**
 * Actualizar un rol
 */
export const updateRol = async (id, data) => {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

/**
 * Actualizar permisos de un rol
 */
export const updateRolPermisos = async (id, permisos) => {
  const response = await api.put(`${BASE_URL}/${id}/permisos`, { permisos });
  return response.data;
};

/**
 * Eliminar un rol
 */
export const deleteRol = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export default {
  getRoles,
  getRolById,
  getRolPermisos,
  createRol,
  updateRol,
  updateRolPermisos,
  deleteRol,
};
