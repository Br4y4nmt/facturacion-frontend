import { useState, useEffect, useCallback } from "react";
import * as planesService from "@/services/planes.service";

export function usePlanes() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Estadísticas calculadas
  const stats = {
    total: planes.length,
    activos: planes.filter((p) => p.activo).length,
    inactivos: planes.filter((p) => !p.activo).length,
    totalEmpresas: planes.reduce((acc, p) => acc + (p.empresasCount || 0), 0),
  };

  // Cargar planes
  const fetchPlanes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await planesService.getPlanes();
      // El backend responde { ok, planes, stats }
      setPlanes(response.planes || []);
    } catch (err) {
      console.error("Error al cargar planes:", err);
      setError(err.response?.data?.error || "Error al cargar planes");
      setPlanes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear plan
  const createPlan = async (data) => {
    try {
      setLoadingCreate(true);
      const response = await planesService.createPlan(data);
      // El backend responde { ok, plan }
      const newPlan = response.plan || response;
      setPlanes((prev) => [...prev, newPlan]);
      return newPlan;
    } finally {
      setLoadingCreate(false);
    }
  };

  // Actualizar plan
  const updatePlan = async (id, data) => {
    try {
      setLoadingUpdate(true);
      const response = await planesService.updatePlan(id, data);
      // El backend responde { ok, plan }
      const updatedPlan = response.plan || response;
      setPlanes((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedPlan } : p))
      );
      return updatedPlan;
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Eliminar plan
  const deletePlan = async (id) => {
    try {
      setLoadingDelete(true);
      await planesService.deletePlan(id);
      setPlanes((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setLoadingDelete(false);
    }
  };

  // Toggle estado activo/inactivo
  const toggleEstado = async (id) => {
    try {
      setLoadingUpdate(true);
      const response = await planesService.toggleEstado(id);
      // El backend responde { ok, plan }
      const updatedPlan = response.plan || response;
      setPlanes((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedPlan } : p))
      );
      return updatedPlan;
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      throw err;
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    fetchPlanes();
  }, [fetchPlanes]);

  return {
    planes,
    loading,
    error,
    stats,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    refetch: fetchPlanes,
    createPlan,
    updatePlan,
    deletePlan,
    toggleEstado,
  };
}
