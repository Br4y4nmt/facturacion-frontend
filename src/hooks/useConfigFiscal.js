import { useCallback, useEffect, useState } from "react";
import {
  getConfigFiscalByEmpresa,
  updateConfigFiscalByEmpresa,
  uploadCertificadoByEmpresa,
} from "@/services/configfiscal.service";

export function useConfigFiscal(empresaId) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false); 
  const [error, setError] = useState(null);

  const fetchConfig = useCallback(async () => {
    if (!empresaId) {
      setConfig(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getConfigFiscalByEmpresa(empresaId);
      setConfig(data);
      return data;
    } catch (e) {
      console.error("Error cargando config fiscal:", e);
      setError(e);
      setConfig(null);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const saveConfig = useCallback(
    async (payload) => {
      if (!empresaId) return;

      setSaving(true);
      setError(null);

      try {
        const data = await updateConfigFiscalByEmpresa(empresaId, payload);
        setConfig(data);
        return data;
      } catch (e) {
        console.error("Error guardando config fiscal:", e);
        setError(e);
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [empresaId]
  );

  const uploadCertificado = useCallback(
    async (file) => {
      if (!empresaId || !file) return;

      setUploading(true);
      setError(null);

      try {
        const resp = await uploadCertificadoByEmpresa(empresaId, file);
        if (resp?.config) setConfig(resp.config);

        return resp;
      } catch (e) {
        console.error("Error subiendo certificado:", e);
        setError(e);
        throw e;
      } finally {
        setUploading(false);
      }
    },
    [empresaId]
  );

  return {
    config,
    setConfig,
    loading,
    saving,
    uploading, 
    error,
    refetch: fetchConfig,
    saveConfig,
    uploadCertificado, 
    empresaId,
  };
}
