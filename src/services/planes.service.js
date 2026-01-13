import api from "./api";

const BASE_URL = "/planes";

/**
 * Obtener todos los planes de servicio
 */
export const getPlanes = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

/**
 * Obtener un plan por ID
 */
export const getPlanById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Crear un nuevo plan
 */
export const createPlan = async (data) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

/**
 * Actualizar un plan
 */
export const updatePlan = async (id, data) => {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

/**
 * Eliminar un plan
 */
export const deletePlan = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};


/**
 * Cambiar estado activo/inactivo de un plan
 */
export const toggleEstado = async (id) => {
  const response = await api.patch(`${BASE_URL}/${id}/estado`);
  return response.data;
};
