import React, { useEffect, useMemo, useState } from "react";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useSunatStatus } from "@/hooks/useSunatStatus";
import {
  IconServer,
  IconShield,
  IconDocument,
  IconClock,
  IconCheck,
  IconX,
  IconWarning,
  IconRefresh,
  IconDownload,
  IconArrowRight,
} from "@/components/icons";


const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "#10B981" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-500 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
      </div>
    </div>
  );
};

const StatusCard = ({ icon, title, value, subtitle, status, gradient, pulse }) => {
  const gradients = {
    green: "from-emerald-500 to-teal-600",
    red: "from-red-500 to-rose-600",
    blue: "from-blue-500 to-indigo-600",
    yellow: "from-amber-500 to-orange-500",
    purple: "from-purple-500 to-violet-600",
    gray: "from-slate-400 to-gray-500",
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradients[gradient] || gradients.blue}`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradients[gradient] || gradients.blue} shadow-lg`}>
            <div className="text-white">{icon}</div>
          </div>
          {pulse && (
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
      
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[gradient] || gradients.blue} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    </div>
  );
};

const StatMiniCard = ({ icon, label, value, trend, trendUp }) => (
  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          <span>{trend}</span>
          <svg className={`w-4 h-4 ${!trendUp && 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
      )}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const config = {
    ACEPTADO: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    RECHAZADO: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
    PENDIENTE: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
    OBSERVADO: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
    ENVIANDO: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  };

  const { bg, text, border, dot } = config[status] || config.PENDIENTE;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${bg} ${text} ${border}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`}></span>
      {status}
    </span>
  );
};

const TipoBadge = ({ tipo }) => {
  const config = {
    FAC: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Factura" },
    BOL: { bg: "bg-purple-100", text: "text-purple-700", label: "Boleta" },
    NC: { bg: "bg-rose-100", text: "text-rose-700", label: "N. Crédito" },
    ND: { bg: "bg-amber-100", text: "text-amber-700", label: "N. Débito" },
    GR: { bg: "bg-teal-100", text: "text-teal-700", label: "Guía Rem." },
  };

  const { bg, text, label } = config[tipo] || { bg: "bg-gray-100", text: "text-gray-700", label: tipo };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
};

export default function EstadoSunat() {
  const {
    empresas,
    loading: loadingEmpresas,
    error: errorEmpresas,
    refetch: refetchEmpresas,
  } = useEmpresas();

  const [selectedEmpresaId, setSelectedEmpresaId] = useState(null);

  const {
    connectionStatus,
    certificateInfo,
    comprobantesResumen,
    ultimosEnvios,
    comprobantesErrores,
    loading,
    loadingConnection,
    loadingSync,
    error,
    refetch,
    testConnection,
    syncPendientes,
    descargarArchivo,
  } = useSunatStatus(selectedEmpresaId);

  useEffect(() => {
    if (!selectedEmpresaId && Array.isArray(empresas) && empresas.length > 0) {
      setSelectedEmpresaId(empresas[0].id);
    }
  }, [empresas, selectedEmpresaId]);

  const selectedEmpresa = useMemo(() => {
    return (empresas || []).find((e) => e.id === selectedEmpresaId) || null;
  }, [empresas, selectedEmpresaId]);

  const certificateDaysLeft = useMemo(() => {

    return null;
  }, [certificateInfo]);

  const successRate = useMemo(() => {
    const total = comprobantesResumen?.total || 0;
    const aceptados = comprobantesResumen?.aceptados || 0;
    if (total === 0) return 100;
    return Math.round((aceptados / total) * 100);
  }, [comprobantesResumen]);

  const handleTestConnection = async () => {
    try {
      await testConnection();
    } catch (err) {
      console.error("Error al probar conexión:", err);
    }
  };

  const handleSyncPendientes = async () => {
    try {
      await syncPendientes();
    } catch (err) {
      console.error("Error al sincronizar:", err);
    }
  };

  const handleDescargarCDR = async (envioId, serie, numero) => {
    try {
      await descargarArchivo(envioId, 'CDR_ZIP', `CDR_${serie}-${numero}.zip`);
    } catch (err) {
      console.error("Error al descargar CDR:", err);
    }
  };

  // Formatear fecha
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
  };

  // Estados de vista
  let view = "READY";
  if (loadingEmpresas) view = "LOADING_EMPRESAS";
  else if (errorEmpresas) view = "ERROR_EMPRESAS";
  else if (!empresas || empresas.length === 0) view = "EMPTY_EMPRESAS";
  else if (!selectedEmpresaId) view = "NO_SELECTED";
  else if (loading) view = "LOADING";
  else if (error) view = "ERROR";

  if (view === "LOADING_EMPRESAS" || view === "LOADING") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (view === "ERROR_EMPRESAS" || view === "ERROR") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconX className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error de conexión</h2>
          <p className="text-gray-500 mb-6">No se pudo cargar la información. Por favor, intente nuevamente.</p>
          <button
            onClick={view === "ERROR_EMPRESAS" ? refetchEmpresas : refetch}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <IconRefresh className="w-5 h-5" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (view === "EMPTY_EMPRESAS" || view === "NO_SELECTED") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconDocument className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sin empresas</h2>
          <p className="text-gray-500">No hay empresas registradas para monitorear.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">

      <div className="bg-gradient-to-r from-[#0B1437] via-[#1a2555] to-[#0B1437] text-white">
        <div className="px-6 py-6">     
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Estado SUNAT</h1>
              <p className="text-indigo-200 text-sm mt-1">Panel de monitoreo y control de comprobantes electrónicos</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleTestConnection}
                disabled={loadingConnection}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                {loadingConnection ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <IconServer className="w-4 h-4" />
                )}
                Probar Conexión
              </button>

              <button
                onClick={handleSyncPendientes}
                disabled={loadingSync}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30 disabled:opacity-50"
              >
                {loadingSync ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <IconRefresh className="w-4 h-4" />
                )}
                Sincronizar
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs text-indigo-200 mb-1.5 font-medium uppercase tracking-wide">Empresa seleccionada</label>
                <select
                  value={selectedEmpresaId || ""}
                  onChange={(e) => setSelectedEmpresaId(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-white/30 focus:outline-none appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
                >
                  {empresas?.map((e) => (
                    <option key={e.id} value={e.id} className="text-gray-900 bg-white">
                      {e.ruc} — {e.razonSocial}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedEmpresa && (
                <div className="hidden lg:flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-indigo-300">RUC:</span>
                    <span className="ml-2 font-semibold">{selectedEmpresa.ruc}</span>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div>
                    <span className="text-indigo-300">Ambiente:</span>
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${connectionStatus?.environment === 'PROD' ? 'bg-red-500' : 'bg-amber-500'}`}>
                      {connectionStatus?.environment || 'BETA'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatusCard
            icon={<IconServer className="w-6 h-6" />}
            title="Conexión SUNAT"
            value={connectionStatus?.isConnected ? "Conectado" : "Desconectado"}
            subtitle={connectionStatus?.lastTest ? `Última prueba: ${formatDateShort(connectionStatus.lastTest)}` : "Sin pruebas recientes"}
            status={connectionStatus?.isConnected ? "online" : "offline"}
            gradient={connectionStatus?.isConnected ? "green" : "red"}
            pulse={true}
          />

          <StatusCard
            icon={<IconShield className="w-6 h-6" />}
            title="Certificado Digital"
            value={certificateInfo?.isValid ? "Válido" : "No configurado"}
            subtitle={certificateInfo?.status === "OK" ? "Certificado activo" : "Requiere configuración"}
            gradient={certificateInfo?.isValid ? "green" : "gray"}
          />

          <StatusCard
            icon={<IconDocument className="w-6 h-6" />}
            title="Comprobantes Enviados"
            value={comprobantesResumen?.total ?? 0}
            subtitle="Este mes"
            gradient="blue"
          />

          <StatusCard
            icon={<IconClock className="w-6 h-6" />}
            title="Pendientes"
            value={comprobantesResumen?.pendientes ?? 0}
            subtitle="Por enviar a SUNAT"
            gradient={comprobantesResumen?.pendientes > 0 ? "yellow" : "gray"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatMiniCard
              icon={<IconCheck className="w-5 h-5 text-emerald-600" />}
              label="Aceptados"
              value={comprobantesResumen?.aceptados ?? 0}
              trend="+12%"
              trendUp={true}
            />
            <StatMiniCard
              icon={<IconX className="w-5 h-5 text-red-600" />}
              label="Rechazados"
              value={comprobantesResumen?.rechazados ?? 0}
            />
            <StatMiniCard
              icon={<IconWarning className="w-5 h-5 text-amber-600" />}
              label="Con Observaciones"
              value={comprobantesResumen?.observados ?? 0}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <CircularProgress 
                percentage={successRate} 
                color={successRate >= 90 ? "#10B981" : successRate >= 70 ? "#F59E0B" : "#EF4444"}
              />
              <p className="mt-3 text-sm font-medium text-gray-500">Tasa de éxito</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Últimos Envíos</h3>
                <p className="text-sm text-gray-500">Historial de comprobantes enviados</p>
              </div>
              <button className="text-[#0B1437] hover:text-[#1a2555] text-sm font-medium flex items-center gap-1 transition-colors">
                Ver todos
                <IconArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Comprobante</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ultimosEnvios.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <IconDocument className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">No hay envíos recientes</p>
                          <p className="text-gray-400 text-sm">Los comprobantes enviados aparecerán aquí</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    ultimosEnvios.slice(0, 5).map((envio, index) => (
                      <tr key={envio.id ?? `envio-${index}`} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <TipoBadge tipo={envio.tipoComprobante || envio.tipoDoc || envio.tipo} />
                            <span className="font-semibold text-gray-900">
                              {envio.serie}-{(envio.numero || envio.correlativo)?.toString().padStart(8, "0")}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(envio.fechaEnvio || envio.fecha || envio.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={envio.estado || envio.estadoSunat} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          {(envio.estado === "ACEPTADO" || envio.estadoSunat === "ACEPTADO") && (
                            <button
                              onClick={() => handleDescargarCDR(envio.id, envio.serie, envio.numero || envio.correlativo)}
                              className="inline-flex items-center gap-1 text-[#0B1437] hover:text-[#1a2555] text-sm font-medium transition-colors"
                            >
                              <IconDownload className="w-4 h-4" />
                              CDR
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-red-500">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <IconWarning className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Requieren Atención</h3>
                  <p className="text-sm text-gray-500">Comprobantes con errores o rechazados</p>
                </div>
              </div>
              <span className="bg-red-100 text-red-700 text-sm font-bold px-3 py-1 rounded-full">
                {comprobantesErrores.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Comprobante</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Error</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comprobantesErrores.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                            <IconCheck className="w-6 h-6 text-emerald-600" />
                          </div>
                          <p className="text-gray-900 font-medium">¡Todo en orden!</p>
                          <p className="text-gray-400 text-sm">No hay comprobantes con errores</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    comprobantesErrores.slice(0, 5).map((comp, index) => (
                      <tr key={comp.id ?? `error-${index}`} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-semibold text-gray-900 block">
                              {comp.serie}-{comp.numero?.toString().padStart(8, "0")}
                            </span>
                            <span className="text-xs text-gray-400">{formatDate(comp.fechaEnvio || comp.fecha)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-[200px]">
                            <span className="text-xs font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded">
                              {comp.codigoError || comp.codigo || comp.estado}
                            </span>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{comp.mensajeError || comp.mensaje || "Error al procesar"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDescargarCDR(comp.id, comp.serie, comp.numero)}
                            className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
                          >
                            <IconDocument className="w-3.5 h-3.5" />
                            Ver Detalle
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Última actualización: {formatDate(new Date().toISOString())}
          </p>
          <button
            onClick={refetch}
            disabled={loading}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
          >
            <IconRefresh className="w-3.5 h-3.5" />
            Actualizar datos
          </button>
        </div>
      </div>
    </div>
  );
}
