import api from "@/services/api";

const BASE_URL = "/permisos";

/**
 * Obtener todos los permisos
 */
export const getPermisos = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

/**
 * Obtener permisos agrupados por módulo
 */
export const getPermisosModulos = async () => {
  const response = await api.get(`${BASE_URL}/modulos`);
  return response.data;
};

/**
 * Sincronizar permisos del sistema
 */
export const syncPermisos = async () => {
  const response = await api.post(`${BASE_URL}/sync`);
  return response.data;
};

/**
 * Crear un nuevo permiso
 */
export const createPermiso = async (data) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

/**
 * Eliminar un permiso
 */
export const deletePermiso = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export default {
  getPermisos,
  getPermisosModulos,
  syncPermisos,
  createPermiso,
  deletePermiso,
};
