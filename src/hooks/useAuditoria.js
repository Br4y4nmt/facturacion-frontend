import { useState, useEffect, useCallback } from "react";
import auditoriaService from "@/services/auditoria.service";
import dashboardService from "@/services/dashboard.service";

/**
 * Hook para manejar auditoría y estado del sistema
 */
export function useAuditoria(options = {}) {
  const { empresaId = null, autoFetch = true } = options;

  // Estados para logs
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [errorLogs, setErrorLogs] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  // Estados para estadísticas
  const [stats, setStats] = useState({
    totalAcciones: 0,
    accionesHoy: 0,
    erroresHoy: 0,
    comprobantesEmitidos: 0,
    usuariosActivos: 0,
    empresasActivas: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);

  // Estados para servicios
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Estados para alertas
  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  // Cargar logs con filtros
  const fetchLogs = useCallback(async (filters = {}) => {
    setLoadingLogs(true);
    setErrorLogs(null);

    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...filters,
      };

      // Agregar empresaId si está seleccionada
      if (filters.empresaId) {
        params.empresaId = filters.empresaId;
      }

      // Convertir dateRange a fechas
      if (filters.dateRange && filters.dateRange !== "all") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (filters.dateRange) {
          case "today":
            params.fechaDesde = today.toISOString().split("T")[0];
            break;
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            params.fechaDesde = weekAgo.toISOString().split("T")[0];
            break;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            params.fechaDesde = monthAgo.toISOString().split("T")[0];
            break;
        }
      }

      // Mapear filtros
      if (filters.accion) params.accion = filters.accion;
      if (filters.recurso) params.recurso = filters.recurso;
      if (filters.search) params.search = filters.search;

      const response = await auditoriaService.getLogs(params);
      setLogs(response.data || []);
      setPagination(response.pagination || {
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      });
    } catch (err) {
      console.error("Error al cargar logs:", err);
      setErrorLogs(err.message || "Error al cargar logs");
      setLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  // Cargar estadísticas
  const fetchStats = useCallback(async (empresaId = null) => {
    setLoadingStats(true);

    try {
      const response = await auditoriaService.getStats(empresaId);
      setStats(response);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Cargar estado de servicios
  const fetchServices = useCallback(async () => {
    setLoadingServices(true);

    try {
      const response = await dashboardService.getServicesStatus();
      setServices(response.services || []);
    } catch (err) {
      console.error("Error al cargar servicios:", err);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  }, []);

  // Cargar alertas
  const fetchAlerts = useCallback(async () => {
    setLoadingAlerts(true);

    try {
      const response = await dashboardService.getAlerts();
      setAlerts(response.alerts || []);
    } catch (err) {
      console.error("Error al cargar alertas:", err);
      setAlerts([]);
    } finally {
      setLoadingAlerts(false);
    }
  }, []);

  // Refrescar todo
  const refreshAll = useCallback(async (filters = {}) => {
    await Promise.all([
      fetchLogs(filters),
      fetchStats(filters.empresaId || null),
      fetchServices(),
      fetchAlerts(),
    ]);
  }, [fetchLogs, fetchStats, fetchServices, fetchAlerts]);

  // Auto-fetch inicial
  useEffect(() => {
    if (autoFetch) {
      fetchServices();
      fetchAlerts();
      fetchStats(empresaId);
    }
  }, [autoFetch, empresaId, fetchServices, fetchAlerts, fetchStats]);

  return {
    // Logs
    logs,
    loadingLogs,
    errorLogs,
    pagination,
    fetchLogs,

    // Stats
    stats,
    loadingStats,
    fetchStats,

    // Services
    services,
    loadingServices,
    fetchServices,

    // Alerts
    alerts,
    loadingAlerts,
    fetchAlerts,

    // General
    refreshAll,
  };
}

export default useAuditoria;
