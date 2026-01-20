import api from "@/services/api";

/**
 * Servicio para operaciones relacionadas con Suscripciones
 * Base URL: /api/suscripciones
 */

// 1) GET /suscripciones - Listar suscripciones + stats
export const getSuscripciones = async (params = {}) => {
  const response = await api.get("/suscripciones", { params });
  return response.data;
};

// 2) POST /suscripciones - Crear nueva suscripción
export const postCrearSuscripcion = async (data) => {
  const response = await api.post("/suscripciones", data);
  return response.data;
};

// 3) POST /suscripciones/:id/cancelar - Cancelar suscripción
export const postCancelarSuscripcion = async (id, data = {}) => {
  const response = await api.post(`/suscripciones/${id}/cancelar`, data);
  return response.data;
};

// 4) POST /suscripciones/:id/renovar - Renovar suscripción
export const postRenovarSuscripcion = async (id, data = {}) => {
  const response = await api.post(`/suscripciones/${id}/renovar`, data);
  return response.data;
};

export default {
  getSuscripciones,
  postCrearSuscripcion,
  postCancelarSuscripcion,
  postRenovarSuscripcion,
};
