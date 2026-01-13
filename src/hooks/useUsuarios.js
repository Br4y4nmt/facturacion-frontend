import { useState, useEffect, useCallback } from "react";
import usuariosService from "@/services/usuarios.service";

/**
 * Hook para manejar usuarios por empresa
 */
export function useUsuarios(empresaId) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, activos: 0, inactivos: 0, admins: 0 });

  // Estados para operaciones
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Cargar usuarios
  const fetchUsuarios = useCallback(async () => {
    if (!empresaId) {
      setUsuarios([]);
      setStats({ total: 0, activos: 0, inactivos: 0, admins: 0 });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await usuariosService.getUsuariosByEmpresa(empresaId);
      // El backend devuelve { ok, usuarios, stats }
      setUsuarios(response.usuarios || []);
      setStats(response.stats || { total: 0, activos: 0, inactivos: 0, admins: 0 });
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError(err.message || "Error al cargar usuarios");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  // Mapeo de rol string a rolId numérico
  const ROL_MAP = {
    SUPERADMIN: 1,
    ADMIN_EMPRESA: 2,
    OPERADOR: 3,
    CONTADOR: 4,
    USER: 5,
  };

  // Crear usuario
  const createUsuario = useCallback(async (data) => {
    setLoadingCreate(true);
    try {
      // Convertir rol (string) a rolId (number) si es necesario
      const payload = {
        ...data,
        empresaId,
        rolId: data.rolId || ROL_MAP[data.rol] || 3, // Default: OPERADOR
      };
      // Eliminar el campo 'rol' ya que el backend espera 'rolId'
      delete payload.rol;
      
      console.log("[useUsuarios] createUsuario - payload final:", payload);
      
      const nuevoUsuario = await usuariosService.createUsuario(payload);
      setUsuarios((prev) => [...prev, nuevoUsuario]);
      return nuevoUsuario;
    } catch (err) {
      console.error("Error al crear usuario:", err);
      throw err;
    } finally {
      setLoadingCreate(false);
    }
  }, [empresaId]);

  // Actualizar usuario
  const updateUsuario = useCallback(async (id, data) => {
    setLoadingUpdate(true);
    try {
      const usuarioActualizado = await usuariosService.updateUsuario(id, data);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...usuarioActualizado } : u))
      );
      return usuarioActualizado;
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      throw err;
    } finally {
      setLoadingUpdate(false);
    }
  }, []);

  // Eliminar usuario
  const deleteUsuario = useCallback(async (id) => {
    setLoadingDelete(true);
    try {
      await usuariosService.deleteUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      throw err;
    } finally {
      setLoadingDelete(false);
    }
  }, []);

  // Toggle estado
  const toggleStatus = useCallback(async (id) => {
    try {
      const result = await usuariosService.toggleUsuarioStatus(id);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u))
      );
      return result;
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      throw err;
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (id) => {
    try {
      const result = await usuariosService.resetPassword(id);
      return result;
    } catch (err) {
      console.error("Error al resetear contraseña:", err);
      throw err;
    }
  }, []);

  // Cargar al montar o cambiar empresa
  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  return {
    usuarios,
    loading,
    error,
    stats,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    refetch: fetchUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    toggleStatus,
    resetPassword,
  };
}


export default useUsuarios;
