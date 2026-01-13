import api from "./api";

const BASE_URL = "/dashboard";

/**
 * Obtener estado de los servicios del sistema
 */
export const getServicesStatus = async () => {
  const response = await api.get(`${BASE_URL}/services`);
  return response.data;
};

/**
 * Obtener alertas del sistema
 */
export const getAlerts = async () => {
  const response = await api.get(`${BASE_URL}/alerts`);
  return response.data;
};

export default {
  getServicesStatus,
  getAlerts,
};
