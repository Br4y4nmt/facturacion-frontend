import { useState, useEffect, useCallback } from "react";
import localesService from "@/services/locales.service";

/**
 * Hook para manejar locales por empresa
 */
export function useLocales(empresaId) {
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, activos: 0, principales: 0, sucursales: 0 });

  // Estados para operaciones
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Cargar locales
  const fetchLocales = useCallback(async () => {
    if (!empresaId) {
      setLocales([]);
      setStats({ total: 0, activos: 0, principales: 0, sucursales: 0 });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await localesService.getLocalesByEmpresa(empresaId);
      // El backend devuelve { ok, locales, stats }
      setLocales(response.locales || []);
      setStats(response.stats || { total: 0, activos: 0, principales: 0, sucursales: 0 });
    } catch (err) {
      console.error("Error al cargar locales:", err);
      setError(err.response?.data?.error || err.message || "Error al cargar locales");
      setLocales([]);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  // Crear local
  const createLocal = useCallback(async (data) => {
    setLoadingCreate(true);
    try {
      const response = await localesService.createLocal({
        ...data,
        empresaId,
      });
      // El backend devuelve { ok, local }
      const nuevoLocal = response.local;
      setLocales((prev) => [...prev, nuevoLocal]);
      // Actualizar stats
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        activos: nuevoLocal.activo ? prev.activos + 1 : prev.activos,
        principales: nuevoLocal.tipo === "PRINCIPAL" ? prev.principales + 1 : prev.principales,
        sucursales: ["SUCURSAL", "PUNTO_VENTA"].includes(nuevoLocal.tipo) ? prev.sucursales + 1 : prev.sucursales,
      }));
      return nuevoLocal;
    } catch (err) {
      console.error("Error al crear local:", err);
      throw err;
    } finally {
      setLoadingCreate(false);
    }
  }, [empresaId]);

  // Actualizar local
  const updateLocal = useCallback(async (id, data) => {
    setLoadingUpdate(true);
    try {
      const response = await localesService.updateLocal(id, data);
      const localActualizado = response.local;
      setLocales((prev) =>
        prev.map((l) => (l.id === id ? localActualizado : l))
      );
      return localActualizado;
    } catch (err) {
      console.error("Error al actualizar local:", err);
      throw err;
    } finally {
      setLoadingUpdate(false);
    }
  }, []);

  // Eliminar local
  const deleteLocal = useCallback(async (id) => {
    setLoadingDelete(true);
    try {
      await localesService.deleteLocal(id);
      const localEliminado = locales.find((l) => l.id === id);
      setLocales((prev) => prev.filter((l) => l.id !== id));
      // Actualizar stats
      if (localEliminado) {
        setStats((prev) => ({
          ...prev,
          total: prev.total - 1,
          activos: localEliminado.activo ? prev.activos - 1 : prev.activos,
          principales: localEliminado.tipo === "PRINCIPAL" ? prev.principales - 1 : prev.principales,
          sucursales: ["SUCURSAL", "PUNTO_VENTA"].includes(localEliminado.tipo) ? prev.sucursales - 1 : prev.sucursales,
        }));
      }
    } catch (err) {
      console.error("Error al eliminar local:", err);
      throw err;
    } finally {
      setLoadingDelete(false);
    }
  }, [locales]);

  // Toggle estado
  const toggleStatus = useCallback(async (id) => {
    try {
      const response = await localesService.toggleLocalEstado(id);
      const localActualizado = response.local;
      setLocales((prev) =>
        prev.map((l) => (l.id === id ? { ...l, activo: localActualizado.activo } : l))
      );
      // Actualizar stats
      setStats((prev) => ({
        ...prev,
        activos: localActualizado.activo ? prev.activos + 1 : prev.activos - 1,
      }));
      return response;
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      throw err;
    }
  }, []);

  // Cargar al montar o cambiar empresaId
  useEffect(() => {
    fetchLocales();
  }, [fetchLocales]);

  return {
    locales,
    loading,
    error,
    stats,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    refetch: fetchLocales,
    createLocal,
    updateLocal,
    deleteLocal,
    toggleStatus,
  };
}

export default useLocales;
