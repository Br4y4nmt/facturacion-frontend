import React, { useEffect, useMemo, useState } from "react";
import FiscalSettingsForm from "@/components/ui/FiscalSettingsForm";
import { useConfigFiscal } from "@/hooks/useConfigFiscal";
import { useEmpresas } from "@/hooks/useEmpresas";

const DEFAULT_CONFIG = {
  taxPercent: 18,
  currency: "PEN",
  pricesIncludeTax: true,
  sunatEnvironment: "BETA",
  solUser: "",
  solPass: "",
  certFilePath: "",
  certPassword: "",
};

export default function ConfiguracionFiscal() {
const [certFile, setCertFile] = useState(null);
  const {
    empresas,
    loading: loadingEmpresas,
    error: errorEmpresas,
    refetch: refetchEmpresas,
  } = useEmpresas();

  const [selectedEmpresaId, setSelectedEmpresaId] = useState(null);

  const {
    config,
    setConfig,
    loading: loadingFiscal,
    saving,
    saveConfig,
    uploadCertificado, 
    uploading, 
    error: errorFiscal,
    refetch: refetchFiscal,
  } = useConfigFiscal(selectedEmpresaId);

  useEffect(() => {
    if (!selectedEmpresaId && Array.isArray(empresas) && empresas.length > 0) {
      setSelectedEmpresaId(empresas[0].id);
    }
  }, [empresas, selectedEmpresaId]);

  const safeConfig = useMemo(() => {
    const base = { ...DEFAULT_CONFIG, ...(config || {}) };
    return {
      ...base,
      comprobantes:
        Array.isArray(base.comprobantes) && base.comprobantes.length > 0
          ? base.comprobantes
          : DEFAULT_CONFIG.comprobantes,
    };
  }, [config]);

  const enabledCount = useMemo(
    () => (safeConfig.comprobantes || []).filter((c) => c.enabled).length,
    [safeConfig.comprobantes]
  );

  const selectedEmpresa = useMemo(() => {
    return (empresas || []).find((e) => e.id === selectedEmpresaId) || null;
  }, [empresas, selectedEmpresaId]);

  const onChangeGeneral = (patch) => {
    setConfig((prev) => ({ ...(prev || {}), ...patch }));
  };

  const onChangeComprobante = (tipo, patch) => {
    setConfig((prev) => {
      const prevSafe = { ...DEFAULT_CONFIG, ...(prev || {}) };
      return {
        ...prevSafe,
        comprobantes: (prevSafe.comprobantes || []).map((c) =>
          c.tipo === tipo ? { ...c, ...patch } : c
        ),
      };
    });
  };
  const handleSave = async () => {
    const payload = {
      taxPercent: safeConfig.taxPercent,
      currency: safeConfig.currency,
      pricesIncludeTax: safeConfig.pricesIncludeTax,

      sunatEnvironment: safeConfig.sunatEnvironment,
      solUser: safeConfig.solUser,
      solPass: safeConfig.solPass,
      certPassword: safeConfig.certPassword,
    };

    try {
      const resPut = await saveConfig(payload);

      if (certFile) {
        const resUpload = await uploadCertificado(certFile);
        setCertFile(null);
      }

      await refetchFiscal?.();
    } catch (e) {
      console.error("ERROR al guardar:", e);
    }
  };




  let view = "READY";
  if (loadingEmpresas) view = "LOADING_EMPRESAS";
  else if (errorEmpresas) view = "ERROR_EMPRESAS";
  else if (!empresas || empresas.length === 0) view = "EMPTY_EMPRESAS";
  else if (!selectedEmpresaId) view = "NO_SELECTED";
  else if (loadingFiscal) view = "LOADING_FISCAL";
  else if (errorFiscal) view = "ERROR_FISCAL";

  if (view === "LOADING_EMPRESAS") {
    return (
      <div className="p-6 min-h-screen bg-[#F8FAFC] font-[Montserrat] flex items-center justify-center">
        <p className="text-sm text-gray-500">Cargando empresas...</p>
      </div>
    );
  }

  if (view === "ERROR_EMPRESAS") {
    return (
      <div className="p-6 min-h-screen bg-[#F8FAFC] font-[Montserrat] flex items-center justify-center">
        <div className="max-w-xl text-center">
          <h1 className="text-lg font-semibold text-[#0B1437] mb-2">
            Configuración Fiscal
          </h1>
          <p className="text-sm text-gray-500">
            No se pudo cargar la lista de empresas.
          </p>
          <button
            onClick={refetchEmpresas}
            className="mt-4 bg-[#283046] hover:bg-[#0C102A] text-white text-sm font-medium px-4 py-2 rounded-md shadow-md transition-all duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (view === "EMPTY_EMPRESAS") {
    return (
      <div className="p-6 min-h-screen bg-[#F8FAFC] font-[Montserrat] flex items-center justify-center">
        <div className="max-w-xl text-center">
          <h1 className="text-lg font-semibold text-[#0B1437] mb-2">
            Configuración Fiscal
          </h1>
          <p className="text-sm text-gray-500">
            No hay empresas registradas para configurar.
          </p>
        </div>
      </div>
    );
  }

  if (view === "NO_SELECTED") {
    return (
      <div className="p-6 min-h-screen bg-[#F8FAFC] font-[Montserrat] flex items-center justify-center">
        <p className="text-sm text-gray-500">Selecciona una empresa...</p>
      </div>
    );
  }

  if (view === "LOADING_FISCAL") {
    return (
      <div className="p-6 min-h-screen bg-[#F8FAFC] font-[Montserrat] flex items-center justify-center">
        <p className="text-sm text-gray-500">
          Cargando configuración fiscal...
        </p>
      </div>
    );
  }

  if (view === "ERROR_FISCAL") {
    return (
      <div className="p-6 min-h-screen bg-[#F8FAFC] font-[Montserrat] flex items-center justify-center">
        <div className="max-w-xl text-center">
          <h1 className="text-lg font-semibold text-[#0B1437] mb-2">
            Configuración Fiscal
          </h1>
          <p className="text-sm text-gray-500">
            No se pudo cargar la configuración fiscal de la empresa seleccionada.
          </p>
          <button
            onClick={refetchFiscal}
            className="mt-4 bg-[#283046] hover:bg-[#0C102A] text-white text-sm font-medium px-4 py-2 rounded-md shadow-md transition-all duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#F8FAFC] font-[Montserrat]">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
        <div className="bg-[#0B1437] text-white px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium">Seleccionar empresa</h2>
            <p className="text-xs text-white/70">
              Configura fiscalmente la empresa elegida.
            </p>
          </div>

          <select
            value={selectedEmpresaId}
            onChange={(e) => setSelectedEmpresaId(Number(e.target.value))}
            className="w-full md:w-[460px] border border-white/20 rounded-md px-3 py-2 text-sm bg-white text-[#0B1437] focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
          >
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.ruc} — {e.razonSocial}
              </option>
            ))}
          </select>
        </div>

        <div className="px-6 py-4 text-sm text-[#64748B]">
          <span className="font-semibold text-[#0B1437]">Seleccionada:</span>{" "}
          {selectedEmpresa ? (
            <>
              {selectedEmpresa.razonSocial} (RUC: {selectedEmpresa.ruc})
            </>
          ) : (
            "—"
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-lg font-semibold text-[#0B1437]">
          Configuración Fiscal
        </h1>
        <p className="text-sm text-[#64748B]">
          Parámetros generales y credenciales SUNAT.
        </p>
      </div>

      <button
        onClick={handleSave}
        disabled={saving || uploading}
        className="flex items-center gap-2 bg-[#283046] hover:bg-[#0C102A] disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-md shadow-md transition-all duration-200"
      >
        {saving || uploading ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
        <div className="bg-[#0B1437] text-white px-6 py-4">
          <h2 className="text-lg font-medium">Parámetros fiscales</h2>
        </div>
        <div className="p-6">
          <FiscalSettingsForm value={safeConfig} onChange={onChangeGeneral} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mt-6">
        <div className="bg-[#0B1437] text-white px-6 py-4">
          <h2 className="text-lg font-medium">Ambiente SUNAT</h2>
        </div>
        <div className="p-6">
          <label className="block text-sm text-[#64748B] mb-1">Ambiente</label>
          <select
            value={safeConfig.sunatEnvironment}
            onChange={(e) =>
              setConfig((prev) => ({ ...(prev || {}), sunatEnvironment: e.target.value }))
            }
            className="w-full md:w-72 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#2C3E50] focus:outline-none bg-white"
          >
            <option value="BETA">BETA (Pruebas)</option>
            <option value="PROD">PRODUCCIÓN</option>
          </select>
          <p className="text-xs text-[#94A3B8] mt-2">
            * BETA para pruebas con SUNAT. PRODUCCIÓN para emisión real.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mt-6">
        <div className="bg-[#0B1437] text-white px-6 py-4">
          <h2 className="text-lg font-medium">Credenciales SOL</h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#64748B] mb-1">Usuario SOL</label>
            <input
              value={safeConfig.solUser || ""}
              onChange={(e) =>
                setConfig((prev) => ({ ...(prev || {}), solUser: e.target.value }))
              }
              placeholder="Ej: MODDATOS"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-[#64748B] mb-1">Clave SOL</label>
            <input
              type="password"
              value={safeConfig.solPass || ""}
              onChange={(e) =>
                setConfig((prev) => ({ ...(prev || {}), solPass: e.target.value }))
              }
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <p className="text-xs text-[#94A3B8]">
              * Estas credenciales se usan para autenticarte en SUNAT (Directo, sin OSE).
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mt-6">
        <div className="bg-[#0B1437] text-white px-6 py-4">
          <h2 className="text-lg font-medium">Certificado digital (PFX/P12)</h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#64748B] mb-1">
              Archivo (.pfx / .p12)
            </label>
            <input
              type="file"
              accept=".pfx,.p12"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setCertFile(file);
                setConfig((prev) => ({
                  ...(prev || {}),
                  certFilePath: file ? file.name : "",
                }));
              }}
              className="w-full text-sm"
            />

            {safeConfig.certFilePath ? (
              <p className="text-xs text-[#0B1437] mt-2">
                Archivo seleccionado:{" "}
                <span className="font-semibold">{safeConfig.certFilePath}</span>
              </p>
            ) : (
              <p className="text-xs text-[#94A3B8] mt-2">
                No se ha seleccionado archivo.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-[#64748B] mb-1">
              Contraseña del certificado
            </label>
            <input
              type="password"
              value={safeConfig.certPassword || ""}
              onChange={(e) =>
                setConfig((prev) => ({ ...(prev || {}), certPassword: e.target.value }))
              }
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
            />
            <p className="text-xs text-[#94A3B8] mt-2">
              * Se usará para firmar el XML antes de enviarlo a SUNAT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
