import { useState, useEffect, useCallback } from "react";
import rolesService from "@/services/roles.service";
import permisosService from "@/services/permisos.service";

/**
 * Hook para manejar roles y permisos
 */
export function useRoles() {
  const [roles, setRoles] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingModulos, setLoadingModulos] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, defaults: 0, custom: 0, totalUsuarios: 0 });

  // Estados para operaciones
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Cargar roles
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await rolesService.getRoles();
      setRoles(response.roles || []);
      setStats(response.stats || { total: 0, defaults: 0, custom: 0, totalUsuarios: 0 });
    } catch (err) {
      console.error("Error al cargar roles:", err);
      setError(err.response?.data?.error || err.message || "Error al cargar roles");
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar módulos de permisos
  const fetchModulos = useCallback(async () => {
    setLoadingModulos(true);

    try {
      const response = await permisosService.getPermisosModulos();
      setModulos(response.modulos || []);
    } catch (err) {
      console.error("Error al cargar módulos:", err);
      // Si falla, usar módulos vacíos
      setModulos([]);
    } finally {
      setLoadingModulos(false);
    }
  }, []);

  // Crear rol
  const createRol = useCallback(async (data) => {
    setLoadingCreate(true);
    try {
      const response = await rolesService.createRol(data);
      const nuevoRol = response.rol;
      setRoles((prev) => [...prev, nuevoRol]);
      // Actualizar stats
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        custom: prev.custom + 1,
      }));
      return nuevoRol;
    } catch (err) {
      console.error("Error al crear rol:", err);
      throw err;
    } finally {
      setLoadingCreate(false);
    }
  }, []);

  // Actualizar rol
  const updateRol = useCallback(async (id, data) => {
    setLoadingUpdate(true);
    try {
      const response = await rolesService.updateRol(id, data);
      const rolActualizado = response.rol;
      setRoles((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...rolActualizado } : r))
      );
      return rolActualizado;
    } catch (err) {
      console.error("Error al actualizar rol:", err);
      throw err;
    } finally {
      setLoadingUpdate(false);
    }
  }, []);

  // Eliminar rol
  const deleteRol = useCallback(async (id) => {
    setLoadingDelete(true);
    try {
      await rolesService.deleteRol(id);
      const rolEliminado = roles.find((r) => r.id === id);
      setRoles((prev) => prev.filter((r) => r.id !== id));
      // Actualizar stats
      if (rolEliminado) {
        setStats((prev) => ({
          ...prev,
          total: prev.total - 1,
          custom: rolEliminado.esDefault ? prev.custom : prev.custom - 1,
          defaults: rolEliminado.esDefault ? prev.defaults - 1 : prev.defaults,
          totalUsuarios: prev.totalUsuarios - (rolEliminado.usuariosAsignados || 0),
        }));
      }
    } catch (err) {
      console.error("Error al eliminar rol:", err);
      throw err;
    } finally {
      setLoadingDelete(false);
    }
  }, [roles]);

  // Cargar al montar
  useEffect(() => {
    fetchRoles();
    fetchModulos();
  }, [fetchRoles, fetchModulos]);

  return {
    roles,
    modulos,
    loading,
    loadingModulos,
    error,
    stats,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    refetch: fetchRoles,
    refetchModulos: fetchModulos,
    createRol,
    updateRol,
    deleteRol,
  };
}

export default useRoles;
