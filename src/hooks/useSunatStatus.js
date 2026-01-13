import { useState, useEffect, useCallback } from "react";
import sunatService from "@/services/sunat.service";

/**
 * Hook para manejar el estado de SUNAT de una empresa
 * Consume las APIs de /api/estado_sunat
 */
export function useSunatStatus(empresaId) {
  // Estados principales - adaptados a la respuesta del backend
  const [resumen, setResumen] = useState(null);
  const [ultimosEnvios, setUltimosEnvios] = useState([]);
  const [errores, setErrores] = useState([]);

  // Estados de carga
  const [loading, setLoading] = useState(false);
  const [loadingConnection, setLoadingConnection] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);

  // Errores
  const [error, setError] = useState(null);

  // Cargar datos generales (resumen + últimos + errores)
  const fetchStatus = useCallback(async () => {
    if (!empresaId) return;

    setLoading(true);
    setError(null);

    try {
      const [resumenRes, enviosRes, erroresRes] = await Promise.all([
        sunatService.getResumenEstadoSunat(empresaId).catch(() => null),
        sunatService.getUltimosEnvios(empresaId, { limit: 10 }).catch(() => ({ items: [] })),
        sunatService.getErrores(empresaId, { limit: 10 }).catch(() => ({ items: [] })),
      ]);

      // Guardar resumen completo
      setResumen(resumenRes);
      
      // Extraer items de envíos
      setUltimosEnvios(enviosRes?.items || []);
      
      // Extraer items de errores
      setErrores(erroresRes?.items || []);
    } catch (err) {
      console.error("Error al cargar estado SUNAT:", err);
      setError(err.message || "Error al cargar el estado de SUNAT");
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  // Probar conexión con SUNAT (POST /:empresaId/probar)
  const testConnection = useCallback(async () => {
    if (!empresaId) return null;

    setLoadingConnection(true);
    try {
      const result = await sunatService.postProbarConexion(empresaId);
      // Refrescar resumen después de probar conexión
      await fetchStatus();
      return result;
    } catch (err) {
      console.error("Error al probar conexión:", err);
      throw err;
    } finally {
      setLoadingConnection(false);
    }
  }, [empresaId, fetchStatus]);

  // Sincronizar comprobantes pendientes (POST /:empresaId/sincronizar)
  const syncPendientes = useCallback(async () => {
    if (!empresaId) return null;

    setLoadingSync(true);
    try {
      const result = await sunatService.postSincronizarPendientes(empresaId);
      // Refrescar datos después de sincronizar
      await fetchStatus();
      return result;
    } catch (err) {
      console.error("Error al sincronizar:", err);
      throw err;
    } finally {
      setLoadingSync(false);
    }
  }, [empresaId, fetchStatus]);

  // Obtener detalle de un envío específico
  const getEnvioDetalle = useCallback(async (envioId) => {
    if (!envioId) return null;
    try {
      const result = await sunatService.getEnvioDetalle(envioId);
      return result;
    } catch (err) {
      console.error("Error al obtener detalle del envío:", err);
      throw err;
    }
  }, []);

  // Descargar archivo de un envío (CDR_ZIP, CDR_XML, UBL_XML, ZIP_ENVIADO)
  const descargarArchivo = useCallback(async (envioId, tipo, filename) => {
    if (!envioId || !tipo) return;
    try {
      await sunatService.descargarArchivo(envioId, tipo, filename);
    } catch (err) {
      console.error("Error al descargar archivo:", err);
      throw err;
    }
  }, []);

  // Cargar datos al montar o cambiar empresa
  useEffect(() => {
    if (empresaId) {
      fetchStatus();
    } else {
      // Limpiar estados si no hay empresa
      setResumen(null);
      setUltimosEnvios([]);
      setErrores([]);
    }
  }, [empresaId, fetchStatus]);

  // Datos derivados del resumen para facilitar el uso en el componente
  const connectionStatus = resumen ? {
    isConnected: resumen.sunatConnection === "ONLINE",
    environment: resumen.ambiente,
    lastTest: resumen.lastCheckAt,
    missingFields: resumen.missingConnFields || [],
  } : null;

  const certificateInfo = resumen ? {
    status: resumen.certStatus,
    isValid: resumen.certStatus === "OK",
  } : null;

  const comprobantesResumen = resumen?.kpis ? {
    aceptados: resumen.kpis.aceptadosMes || 0,
    enviados: resumen.kpis.enviadosMes || 0,
    rechazados: resumen.kpis.rechazadosMes || 0,
    errores: resumen.kpis.errorMes || 0,
    total: resumen.kpis.totalMes || 0,
    pendientes: resumen.kpis.pendientesActual || 0,
  } : null;

  return {
    // Datos crudos
    resumen,
    ultimosEnvios,
    errores,

    // Datos procesados para compatibilidad con el componente
    connectionStatus,
    certificateInfo,
    comprobantesResumen,
    comprobantesErrores: errores, // alias

    // Estados
    loading,
    loadingConnection,
    loadingSync,
    error,

    // Acciones
    refetch: fetchStatus,
    testConnection,
    syncPendientes,
    getEnvioDetalle,
    descargarArchivo,
  };
}

export default useSunatStatus;
