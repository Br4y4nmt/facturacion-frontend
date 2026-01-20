import api from "@/services/api";

const BASE_URL = "/pagos";

/**
 * Obtener lista de pagos con filtros opcionales
 * @param {Object} params Query params (empresa, estado, desde, hasta, page, limit, etc.)
 */
export const getPagos = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

/**
 * Obtener un pago por ID
 */
export const getPagoById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Exportar pagos (CSV/Excel) - retorna blob
 */
export const exportPagos = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/export`, {
    params,
    responseType: "blob",
  });
  return response.data;
};

/**
 * Crear pago
 */
export const createPago = async (payload) => {
  const response = await api.post(BASE_URL, payload);
  return response.data;
};

/**
 * Eliminar pago
 */
export const deletePago = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export default {
  getPagos,
  getPagoById,
  exportPagos,
  createPago,
  deletePago,
};
