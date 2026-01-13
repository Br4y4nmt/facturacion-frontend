import api from "@/services/api";

const BASE_URL = "/auditoria";

/**
 * Obtener logs de auditoría con filtros y paginación
 */
export const getLogs = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

/**
 * Obtener estadísticas de auditoría
 */
export const getStats = async (empresaId = null) => {
  const params = empresaId ? { empresaId } : {};
  const response = await api.get(`${BASE_URL}/stats`, { params });
  return response.data;
};

export default {
  getLogs,
  getStats,
};
