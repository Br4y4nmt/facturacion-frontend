import { useState, useEffect, useCallback } from "react";
import rolesService from "@/services/roles.service";
import permisosService from "@/services/permisos.service";

export function useRoles(empresaId) {
  const [roles, setRoles] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingModulos, setLoadingModulos] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    defaults: 0,
    custom: 0,
    totalUsuarios: 0,
  });

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    if (!empresaId) return;


    setRoles([]);
    setStats({
      total: 0,
      defaults: 0,
      custom: 0,
      totalUsuarios: 0,
    });
    setError(null);
  }, [empresaId]);

  const fetchRoles = useCallback(async () => {
    if (!empresaId) return;


    setLoading(true);
    setError(null);

    try {
      const response = await rolesService.getRoles(empresaId);


      setRoles(response.roles || []);
      setStats(
        response.stats || {
          total: 0,
          defaults: 0,
          custom: 0,
          totalUsuarios: 0,
        }
      );
    } catch (err) {
      console.error("Error al cargar roles:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Error al cargar roles"
      );
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  const fetchModulos = useCallback(async () => {

    setLoadingModulos(true);

    try {
      const response = await permisosService.getPermisosModulos();
      setModulos(response.modulos || []);
    } catch (err) {
      console.error("Error al cargar módulos:", err);
      setModulos([]);
    } finally {
      setLoadingModulos(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    fetchModulos();
  }, [fetchModulos]);

  const createRol = useCallback(
    async (data) => {
      if (!empresaId) return;


      setLoadingCreate(true);
      try {
        const response = await rolesService.createRol(empresaId, data);
        const nuevoRol = response.rol;

        setRoles((prev) => [...prev, nuevoRol]);
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
    },
    [empresaId]
  );

  const updateRol = useCallback(
    async (id, data) => {
      if (!empresaId) return;


      setLoadingUpdate(true);
      try {
        const response = await rolesService.updateRol(
          empresaId,
          id,
          data
        );
        const rolActualizado = response.rol;

        setRoles((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, ...rolActualizado } : r
          )
        );

        return rolActualizado;
      } catch (err) {
        console.error("Error al actualizar rol:", err);
        throw err;
      } finally {
        setLoadingUpdate(false);
      }
    },
    [empresaId]
  );

  const deleteRol = useCallback(
    async (id) => {
      if (!empresaId) return;


      setLoadingDelete(true);
      try {
        await rolesService.deleteRol(empresaId, id);

        const rolEliminado = roles.find((r) => r.id === id);

        setRoles((prev) => prev.filter((r) => r.id !== id));

        if (rolEliminado) {
          setStats((prev) => ({
            ...prev,
            total: prev.total - 1,
            custom: rolEliminado.esDefault
              ? prev.custom
              : prev.custom - 1,
            defaults: rolEliminado.esDefault
              ? prev.defaults - 1
              : prev.defaults,
            totalUsuarios:
              prev.totalUsuarios -
              (rolEliminado.usuariosAsignados || 0),
          }));
        }
      } catch (err) {
        console.error("Error al eliminar rol:", err);
        throw err;
      } finally {
        setLoadingDelete(false);
      }
    },
    [roles, empresaId]
  );

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
