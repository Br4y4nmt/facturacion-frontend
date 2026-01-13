import { useCallback, useEffect, useState } from "react";
import { empresasService } from "@/services/empresas.service";
import { showConfirm, showToast, showError } from "@/utils/alert";


export function useEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmpresas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await empresasService.list();
      setEmpresas(data || []);
    } catch (e) {
      setError(e);
      console.error("Error al cargar empresas:", e);
    } finally {
      setLoading(false);
    }
  }, []);


const createEmpresa = useCallback(
  async (payload) => {
    try {
      setSaving(true);
      setError(null);

      const result = await empresasService.create(payload);

      if (result?.empresa) {
        setEmpresas((prev) => [result.empresa, ...prev]);
      } else {
        await fetchEmpresas();
      }

      showToast("success", "Empresa creada correctamente");

      return result;
    } catch (e) {
      setError(e);
      console.error("Error al crear empresa:", e);

      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        "No se pudo crear la empresa";
      showToast("error", msg);

      throw e;
    } finally {
      setSaving(false);
    }
  },
  [fetchEmpresas]
);



const toggleEstado = async (id, estadoActual) => {
  const isActive = Boolean(estadoActual);
  const nuevoEstado = !isActive;
  const confirm = await showConfirm(
    nuevoEstado ? "Activar empresa" : "Desactivar empresa",
    nuevoEstado
      ? "¿Estás seguro de activar esta empresa?"
      : "¿Estás seguro de desactivar esta empresa?"
  );

  if (!confirm) return; 

  setEmpresas((prev) =>
    prev.map((e) =>
      e.id === id ? { ...e, estado: nuevoEstado } : e
    )
  );

  try {

    await empresasService.updateEstado(id, nuevoEstado);

    showToast(
      "success",
      nuevoEstado
        ? "Empresa activada correctamente"
        : "Empresa desactivada correctamente"
    );
  } catch (error) {
    setEmpresas((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, estado: isActive } : e
      )
    );

    showToast("error", "No se pudo cambiar el estado de la empresa");
    console.error(error);
  }
};



const updateEmpresa = useCallback(async (id, payload) => {
    const confirm = await showConfirm(
      "Guardar cambios",
      "¿Deseas guardar los cambios de esta empresa?"
    );
    if (!confirm) return null;

    try {
      setSaving(true);

      const updated = await empresasService.update(id, payload);

      setEmpresas((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
      );

      showToast("success", "Empresa actualizada correctamente");
      return updated;
    } catch (e) {
      showToast("error", "No se pudo actualizar la empresa");
      throw e;
    } finally {
      setSaving(false);
    }
  }, []);



  
  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  return {
    empresas,
    loading,
    saving,
    error,
    refetch: fetchEmpresas,
    createEmpresa,
    updateEmpresa,
    toggleEstado,
  };
}
