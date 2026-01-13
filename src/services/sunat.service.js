import api from "./api";

/**
 * Servicio para operaciones relacionadas con Estado SUNAT
 * Base URL: /api/estado_sunat
 */

// 1) GET /:empresaId/resumen - Obtener resumen/KPIs del estado SUNAT
export const getResumenEstadoSunat = async (empresaId) => {
  const response = await api.get(`/estado_sunat/${empresaId}/resumen`);
  return response.data;
};

// 2) GET /:empresaId/ultimos - Obtener últimos envíos a SUNAT
export const getUltimosEnvios = async (empresaId, params = {}) => {
  const response = await api.get(`/estado_sunat/${empresaId}/ultimos`, { params });
  return response.data;
};

// 3) GET /:empresaId/errores - Obtener envíos con errores (RECHAZADO + ERROR)
export const getErrores = async (empresaId, params = {}) => {
  const response = await api.get(`/estado_sunat/${empresaId}/errores`, { params });
  return response.data;
};

// 4) POST /:empresaId/probar - Probar conexión real a SUNAT
export const postProbarConexion = async (empresaId) => {
  const response = await api.post(`/estado_sunat/${empresaId}/probar`);
  return response.data;
};

// 5) POST /:empresaId/sincronizar - Sincronizar comprobantes pendientes
export const postSincronizarPendientes = async (empresaId) => {
  const response = await api.post(`/estado_sunat/${empresaId}/sincronizar`);
  return response.data;
};

// 6) GET /envios/:envioId - Obtener detalle de un envío específico
export const getEnvioDetalle = async (envioId) => {
  const response = await api.get(`/estado_sunat/envios/${envioId}`);
  return response.data;
};

// 7) GET /envios/:envioId/archivos/:tipo/download - Descargar archivo de envío
// tipo: UBL_XML, ZIP_ENVIADO, CDR_ZIP, CDR_XML
export const downloadEnvioArchivo = async (envioId, tipo) => {
  const response = await api.get(`/estado_sunat/envios/${envioId}/archivos/${tipo}/download`, {
    responseType: "blob",
  });
  return response.data;
};

// Helper para descargar archivo y guardarlo
export const descargarArchivo = async (envioId, tipo, filename) => {
  const blob = await downloadEnvioArchivo(envioId, tipo);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `${tipo}_${envioId}.zip`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export default {
  getResumenEstadoSunat,
  getUltimosEnvios,
  getErrores,
  postProbarConexion,
  postSincronizarPendientes,
  getEnvioDetalle,
  downloadEnvioArchivo,
  descargarArchivo,
};
