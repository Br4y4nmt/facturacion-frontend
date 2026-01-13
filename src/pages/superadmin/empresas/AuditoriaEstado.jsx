import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useAuditoria } from "@/hooks/useAuditoria";
import {
  IconUsers,
  IconRefresh,
  IconWarning,
  IconCheck,
  IconClock,
  IconServer,
  IconShield,
  IconDocument,
  IconSearchNew,
} from "@/components/icons";

const StatusIndicator = ({ status, label, sublabel }) => {
  const statusConfig = {
    online: { color: "bg-emerald-500", ring: "ring-emerald-500/30", text: "text-emerald-600", label: "Operativo" },
    warning: { color: "bg-amber-500", ring: "ring-amber-500/30", text: "text-amber-600", label: "Advertencia" },
    offline: { color: "bg-red-500", ring: "ring-red-500/30", text: "text-red-600", label: "Sin conexión" },
    unknown: { color: "bg-gray-400", ring: "ring-gray-400/30", text: "text-gray-500", label: "Desconocido" },
  };

  const config = statusConfig[status] || statusConfig.unknown;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className={`w-3 h-3 rounded-full ${config.color} ${status === 'online' ? 'animate-pulse' : ''}`} />
        <div className={`absolute inset-0 w-3 h-3 rounded-full ${config.color} opacity-40 ${status === 'online' ? 'animate-ping' : ''}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className={`text-xs ${config.text}`}>{sublabel || config.label}</p>
      </div>
    </div>
  );
};


const ServiceCard = ({ icon, title, status, description, lastCheck, details }) => {
  const statusColors = {
    online: "border-emerald-200 bg-emerald-50/50",
    warning: "border-amber-200 bg-amber-50/50",
    offline: "border-red-200 bg-red-50/50",
    unknown: "border-gray-200 bg-gray-50/50",
  };

  const iconBg = {
    online: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
    offline: "bg-red-100 text-red-600",
    unknown: "bg-gray-100 text-gray-500",
  };

  return (
    <div className={`bg-white rounded-xl border-2 ${statusColors[status]} p-5 hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBg[status]}`}>
          {icon}
        </div>
        <StatusIndicator status={status} label="" sublabel="" />
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      {details && (
        <div className="text-xs text-gray-400 border-t border-gray-100 pt-3 mt-3">
          {details}
        </div>
      )}
      {lastCheck && (
        <p className="text-xs text-gray-400 mt-2">
          Última verificación: {lastCheck}
        </p>
      )}
    </div>
  );
};

// Stat Card compacto
const StatCard = ({ icon, title, value, trend, trendUp, gradient }) => {
  const gradients = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-emerald-500 to-teal-600",
    purple: "from-purple-500 to-violet-600",
    amber: "from-amber-500 to-orange-500",
    red: "from-red-500 to-rose-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradients[gradient] || gradients.blue}`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradients[gradient] || gradients.blue} shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  );
};

const ActionTypeBadge = ({ type }) => {
  const config = {
    CREATE: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Creación" },
    UPDATE: { bg: "bg-blue-100", text: "text-blue-700", label: "Actualización" },
    DELETE: { bg: "bg-red-100", text: "text-red-700", label: "Eliminación" },
    LOGIN: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Inicio sesión" },
    LOGOUT: { bg: "bg-gray-100", text: "text-gray-700", label: "Cierre sesión" },
    EMIT: { bg: "bg-purple-100", text: "text-purple-700", label: "Emisión CPE" },
    VOID: { bg: "bg-orange-100", text: "text-orange-700", label: "Anulación" },
    CONFIG: { bg: "bg-teal-100", text: "text-teal-700", label: "Configuración" },
    ERROR: { bg: "bg-red-100", text: "text-red-700", label: "Error" },
  };

  const { bg, text, label } = config[type] || { bg: "bg-gray-100", text: "text-gray-700", label: type };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${bg} ${text}`}>
      {label}
    </span>
  );
};

const ResourceBadge = ({ resource }) => {
  const config = {
    USUARIO: { icon: "👤", label: "Usuario" },
    EMPRESA: { icon: "🏢", label: "Empresa" },
    FACTURA: { icon: "📄", label: "Factura" },
    BOLETA: { icon: "🧾", label: "Boleta" },
    NOTA_CREDITO: { icon: "📝", label: "N. Crédito" },
    NOTA_DEBITO: { icon: "📋", label: "N. Débito" },
    CLIENTE: { icon: "👥", label: "Cliente" },
    CONFIG: { icon: "⚙️", label: "Config" },
    CERTIFICADO: { icon: "🔐", label: "Certificado" },
  };

  const { icon, label } = config[resource] || { icon: "📁", label: resource };

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
      <span>{icon}</span>
      {label}
    </span>
  );
};

const AuditLogRow = ({ log }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-semibold">
            {log.usuario?.nombre?.[0] || "?"}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{log.usuario?.nombre || "Sistema"}</p>
            <p className="text-xs text-gray-400">{log.usuario?.email || "—"}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <ActionTypeBadge type={log.accion} />
      </td>
      <td className="px-5 py-4">
        <ResourceBadge resource={log.recurso} />
      </td>
      <td className="px-5 py-4">
        <p className="text-sm text-gray-700 max-w-xs truncate" title={log.descripcion}>
          {log.descripcion}
        </p>
      </td>
      <td className="px-5 py-4">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-mono">
          {log.empresa?.razonSocial?.substring(0, 20) || "—"}
        </span>
      </td>
      <td className="px-5 py-4 text-sm text-gray-500">
        {formatDate(log.createdAt)}
      </td>
      <td className="px-5 py-4 text-xs text-gray-400 font-mono">
        {log.ip || "—"}
      </td>
    </tr>
  );
};

const ActivityTimeline = ({ activities }) => {
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  };

  const actionIcons = {
    CREATE: "✨",
    UPDATE: "📝",
    DELETE: "🗑️",
    LOGIN: "🔐",
    EMIT: "📤",
    ERROR: "⚠️",
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id || index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm">
              {actionIcons[activity.accion] || "📌"}
            </div>
            {index < activities.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200 mt-2" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm font-medium text-gray-900">{activity.descripcion}</p>
            <p className="text-xs text-gray-500 mt-1">
              {activity.usuario?.nombre || "Sistema"} • {formatTime(activity.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Iconos para los servicios según su ID/tipo
const getServiceIcon = (service) => {
  const iconMap = {
    1: <IconDocument className="w-6 h-6" />, // SUNAT
    2: <IconServer className="w-6 h-6" />,   // Base de Datos
    3: <IconShield className="w-6 h-6" />,   // Certificados
    4: <IconServer className="w-6 h-6" />,   // API Backend
  };
  return iconMap[service.id] || <IconServer className="w-6 h-6" />;
};

// Formatear fecha de última verificación
const formatLastCheck = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Hace unos segundos";
  if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  
  return date.toLocaleDateString("es-PE");
};


export default function AuditoriaEstado() {
  const { empresas, loading: loadingEmpresas } = useEmpresas();
  const [selectedEmpresaId, setSelectedEmpresaId] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterResource, setFilterResource] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("today");
  const [currentPage, setCurrentPage] = useState(1);

  // Hook de auditoría
  const {
    logs,
    loadingLogs,
    pagination,
    fetchLogs,
    stats,
    loadingStats,
    fetchStats,
    services,
    loadingServices,
    fetchServices,
    alerts,
    loadingAlerts,
    fetchAlerts,
  } = useAuditoria({ autoFetch: true });

  // Cargar logs cuando cambian los filtros
  const loadLogs = useCallback(() => {
    fetchLogs({
      page: currentPage,
      limit: 20,
      empresaId: selectedEmpresaId || undefined,
      accion: filterAction || undefined,
      recurso: filterResource || undefined,
      search: searchTerm || undefined,
      dateRange,
    });
  }, [fetchLogs, currentPage, selectedEmpresaId, filterAction, filterResource, searchTerm, dateRange]);

  // Efecto para cargar logs cuando cambian los filtros
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Efecto para actualizar stats cuando cambia la empresa
  useEffect(() => {
    fetchStats(selectedEmpresaId || null);
  }, [selectedEmpresaId, fetchStats]);

  // Actividad reciente para timeline
  const recentActivity = useMemo(() => logs.slice(0, 5), [logs]);

  // Handler para cambio de página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Reset página cuando cambian otros filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedEmpresaId, filterAction, filterResource, searchTerm, dateRange]);

  if (loadingEmpresas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Cargando...</p>
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
              <h1 className="text-2xl font-bold tracking-tight">Auditoría y Estado del Sistema</h1>
              <p className="text-indigo-200 text-sm mt-1">
                Monitoreo de servicios, logs y actividad del sistema
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <label className="block text-xs text-indigo-200 mb-1.5 font-medium uppercase tracking-wide">
                  Filtrar por Empresa
                </label>
                <select
                  value={selectedEmpresaId}
                  onChange={(e) => setSelectedEmpresaId(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-white/30 focus:outline-none appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '20px',
                  }}
                >
                  <option value="" className="text-gray-900 bg-white">Todas las empresas</option>
                  {empresas?.map((e) => (
                    <option key={e.id} value={e.id} className="text-gray-900 bg-white">
                      {e.ruc} — {e.razonSocial}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-indigo-200 mb-1.5 font-medium uppercase tracking-wide">
                  Período
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-white/30 focus:outline-none appearance-none cursor-pointer hover:bg-white/20 transition-colors min-w-[160px]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '20px',
                  }}
                >
                  <option value="today" className="text-gray-900">Hoy</option>
                  <option value="week" className="text-gray-900">Última semana</option>
                  <option value="month" className="text-gray-900">Último mes</option>
                  <option value="all" className="text-gray-900">Todo</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            icon={<IconDocument className="w-5 h-5" />}
            title="Acciones Hoy"
            value={stats.accionesHoy}
            trend="+12% vs ayer"
            trendUp={true}
            gradient="blue"
          />
          <StatCard
            icon={<IconWarning className="w-5 h-5" />}
            title="Errores Hoy"
            value={stats.erroresHoy}
            trend="-2 vs ayer"
            trendUp={true}
            gradient="red"
          />
          <StatCard
            icon={<IconUsers className="w-5 h-5" />}
            title="Usuarios Activos"
            value={stats.usuariosActivos}
            gradient="purple"
          />
          <StatCard
            icon={<IconDocument className="w-5 h-5" />}
            title="CPE Emitidos"
            value={stats.comprobantesEmitidos}
            trend="+8% vs ayer"
            trendUp={true}
            gradient="green"
          />
          <StatCard
            icon={<IconServer className="w-5 h-5" />}
            title="Empresas Activas"
            value={stats.empresasActivas}
            gradient="amber"
          />
          <StatCard
            icon={<IconClock className="w-5 h-5" />}
            title="Total Registros"
            value={stats.totalAcciones.toLocaleString()}
            gradient="blue"
          />
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <IconServer className="w-5 h-5 text-indigo-600" />
            Estado de Servicios
            {loadingServices && (
              <span className="ml-2 w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                {...service} 
                icon={getServiceIcon(service)}
                lastCheck={formatLastCheck(service.lastCheck)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Registro de Auditoría</h3>
                    <p className="text-sm text-gray-500">
                      {pagination.total} registros encontrados
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 mt-4">
                  <div className="flex-1 relative">
                    <IconSearchNew className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar en logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">Todas las acciones</option>
                    <option value="CREATE">Creación</option>
                    <option value="UPDATE">Actualización</option>
                    <option value="DELETE">Eliminación</option>
                    <option value="LOGIN">Inicio sesión</option>
                    <option value="LOGOUT">Cierre sesión</option>
                    <option value="EMIT">Emisión CPE</option>
                    <option value="VOID">Anulación</option>
                    <option value="CONFIG">Configuración</option>
                    <option value="ERROR">Error</option>
                  </select>
                  <select
                    value={filterResource}
                    onChange={(e) => setFilterResource(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">Todos los recursos</option>
                    <option value="USUARIO">Usuario</option>
                    <option value="EMPRESA">Empresa</option>
                    <option value="FACTURA">Factura</option>
                    <option value="BOLETA">Boleta</option>
                    <option value="NOTA_CREDITO">Nota de Crédito</option>
                    <option value="CLIENTE">Cliente</option>
                    <option value="CONFIG">Configuración</option>
                    <option value="CERTIFICADO">Certificado</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/80">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acción</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Recurso</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Empresa</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loadingLogs ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
                            <p className="text-gray-500">Cargando registros...</p>
                          </div>
                        </td>
                      </tr>
                    ) : logs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                              <IconDocument className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No hay registros</p>
                            <p className="text-gray-400 text-sm">
                              No se encontraron registros con los filtros aplicados
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <AuditLogRow key={log.id} log={log} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Mostrando {logs.length} de {pagination.total} registros
                  {pagination.totalPages > 1 && ` • Página ${pagination.page} de ${pagination.totalPages}`}
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1.5 text-sm rounded-lg ${
                          currentPage === pageNum
                            ? "bg-indigo-600 text-white"
                            : "border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-5 sticky top-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IconClock className="w-4 h-4 text-indigo-600" />
                Actividad Reciente
              </h3>
              {logs.length > 0 ? (
                <ActivityTimeline activities={recentActivity} />
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">Sin actividad reciente</p>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <IconWarning className="w-4 h-4 text-amber-500" />
                  Alertas
                  {loadingAlerts && (
                    <span className="ml-1 w-3 h-3 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
                  )}
                </h4>
                <div className="space-y-3">
                  {alerts.length === 0 ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <p className="text-xs font-medium text-emerald-800">
                        ✓ Sin alertas pendientes
                      </p>
                      <p className="text-xs text-emerald-600 mt-1">
                        Todo el sistema funcionando correctamente
                      </p>
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className={`p-3 rounded-lg border ${
                          alert.type === "error" 
                            ? "bg-red-50 border-red-200" 
                            : "bg-amber-50 border-amber-200"
                        }`}
                      >
                        <p className={`text-xs font-medium ${
                          alert.type === "error" ? "text-red-800" : "text-amber-800"
                        }`}>
                          {alert.title}
                        </p>
                        <p className={`text-xs mt-1 ${
                          alert.type === "error" ? "text-red-600" : "text-amber-600"
                        }`}>
                          {alert.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
