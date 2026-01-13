import api from "@/services/api";

const BASE_URL = "/locales";

/**
 * Obtener locales por empresa
 */
export const getLocalesByEmpresa = async (empresaId) => {
  const response = await api.get(`${BASE_URL}/empresa/${empresaId}`);
  return response.data;
};

/**
 * Obtener un local por ID
 */
export const getLocalById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Crear un nuevo local
 */
export const createLocal = async (data) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

/**
 * Actualizar un local
 */
export const updateLocal = async (id, data) => {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

/**
 * Eliminar un local
 */
export const deleteLocal = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Toggle estado activo/inactivo
 */
export const toggleLocalEstado = async (id) => {
  const response = await api.patch(`${BASE_URL}/${id}/estado`);
  return response.data;
};

export default {
  getLocalesByEmpresa,
  getLocalById,
  createLocal,
  updateLocal,
  deleteLocal,
  toggleLocalEstado,
};
