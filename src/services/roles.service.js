import api from "@/services/api";

const BASE_URL = "/roles";

/**
 * Helper para construir URL con empresaId como query
 */
function withEmpresa(url, empresaId) {
  return empresaId ? `${url}?empresaId=${empresaId}` : url;
}

/**
 * Obtener todos los roles con stats (opcional por empresa)
 * GET /roles?empresaId=1
 */
export const getRoles = async (empresaId) => {
  const url = withEmpresa(BASE_URL, empresaId);
  const response = await api.get(url);
  return response.data;
};

/**
 * Obtener un rol por ID (opcional por empresa)
 * GET /roles/:id?empresaId=1
 */
export const getRolById = async (id, empresaId) => {
  const url = withEmpresa(`${BASE_URL}/${id}`, empresaId);
  const response = await api.get(url);
  return response.data;
};

/**
 * Obtener permisos de un rol (opcional por empresa)
 * GET /roles/:id/permisos?empresaId=1
 */
export const getRolPermisos = async (id, empresaId) => {
  const url = withEmpresa(`${BASE_URL}/${id}/permisos`, empresaId);
  const response = await api.get(url);
  return response.data;
};

/**
 * Crear un nuevo rol (opcional por empresa)
 * POST /roles?empresaId=1
 */
export const createRol = async (empresaId, data) => {
  const url = withEmpresa(BASE_URL, empresaId);
  const response = await api.post(url, data);
  return response.data;
};

/**
 * Actualizar un rol (opcional por empresa)
 * PUT /roles/:id?empresaId=1
 */
export const updateRol = async (empresaId, id, data) => {
  const url = withEmpresa(`${BASE_URL}/${id}`, empresaId);
  const response = await api.put(url, data);
  return response.data;
};

/**
 * Actualizar permisos de un rol (opcional por empresa)
 * PUT /roles/:id/permisos?empresaId=1
 */
export const updateRolPermisos = async (empresaId, id, permisos) => {
  const url = withEmpresa(`${BASE_URL}/${id}/permisos`, empresaId);
  const response = await api.put(url, { permisos });
  return response.data;
};

/**
 * Eliminar un rol (opcional por empresa)
 * DELETE /roles/:id?empresaId=1
 */
export const deleteRol = async (empresaId, id) => {
  const url = withEmpresa(`${BASE_URL}/${id}`, empresaId);
  const response = await api.delete(url);
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
