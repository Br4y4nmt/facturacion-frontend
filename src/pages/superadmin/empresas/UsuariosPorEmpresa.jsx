import React, { useState, useMemo, useEffect } from "react";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useUsuarios } from "@/hooks/useUsuarios";
import ModalUsuario from "@/components/ui/ModalUsuario";
import ModalConfirmDelete from "@/components/ui/ModalConfirmDelete";
import {
  IconUsers,
  IconUser,
  IconUserCheck,
  IconUserX,
  IconPlus,
  IconEdit,
  IconTrash,
  IconKey,
  IconMail,
  IconSearchNew,
  IconRefresh,
  IconWarning,
} from "@/components/icons";

const StatCard = ({ icon, title, value, gradient, iconBg }) => {
  const gradients = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-emerald-500 to-teal-600",
    red: "from-red-500 to-rose-600",
    purple: "from-purple-500 to-violet-600",
    amber: "from-amber-500 to-orange-500",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradients[gradient] || gradients.blue}`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-xl bg-gradient-to-br ${gradients[gradient] || gradients.blue} shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[gradient] || gradients.blue} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    </div>
  );
};

// Badge de rol
const RolBadge = ({ rol }) => {
  const config = {
    SUPERADMIN: { bg: "bg-purple-100", text: "text-purple-700", label: "Super Admin" },
    ADMIN: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Administrador" },
    ADMIN_EMPRESA: { bg: "bg-blue-100", text: "text-blue-700", label: "Admin Empresa" },
    OPERADOR: { bg: "bg-teal-100", text: "text-teal-700", label: "Operador" },
    USER: { bg: "bg-gray-100", text: "text-gray-700", label: "Usuario" },
    CONTADOR: { bg: "bg-amber-100", text: "text-amber-700", label: "Contador" },
  };

  const { bg, text, label } = config[rol] || { bg: "bg-gray-100", text: "text-gray-700", label: rol };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${bg} ${text}`}>
      {label}
    </span>
  );
};

// Badge de estado
const StatusBadge = ({ activo }) => {
  return activo ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
      Activo
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
      <span className="w-2 h-2 rounded-full bg-red-500"></span>
      Inactivo
    </span>
  );
};

// Avatar con iniciales
const Avatar = ({ nombre, apellido, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const initials = `${nombre?.[0] || ""}${apellido?.[0] || ""}`.toUpperCase() || "??";
  
  // Generar color basado en las iniciales
  const colors = [
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-rose-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-blue-500",
  ];
  const colorIndex = (nombre?.charCodeAt(0) || 0) % colors.length;

  return (
    <div className={`${sizes[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold shadow-md`}>
      {initials}
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function UsuariosPorEmpresa() {
  const {
    empresas,
    loading: loadingEmpresas,
    error: errorEmpresas,
  } = useEmpresas();

  const [selectedEmpresaId, setSelectedEmpresaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRol, setFilterRol] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create | edit
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);

  const {
    usuarios,
    loading,
    error,
    stats,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    refetch,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    toggleStatus,
    resetPassword,
  } = useUsuarios(selectedEmpresaId);

  // Auto-seleccionar primera empresa
  useEffect(() => {
    if (!selectedEmpresaId && Array.isArray(empresas) && empresas.length > 0) {
      setSelectedEmpresaId(empresas[0].id);
    }
  }, [empresas, selectedEmpresaId]);

  const selectedEmpresa = useMemo(() => {
    return (empresas || []).find((e) => e.id === selectedEmpresaId) || null;
  }, [empresas, selectedEmpresaId]);

  // Filtrar usuarios
  const filteredUsuarios = useMemo(() => {
    return usuarios.filter((u) => {
      const matchSearch =
        !searchTerm ||
        u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRol = !filterRol || u.rol === filterRol;
      const matchStatus = filterStatus === "" || u.activo === (filterStatus === "activo");

      return matchSearch && matchRol && matchStatus;
    });
  }, [usuarios, searchTerm, filterRol, filterStatus]);

  // Handlers
  const handleOpenCreate = () => {
    setSelectedUsuario(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleOpenEdit = (usuario) => {
    setSelectedUsuario(usuario);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleSubmitUsuario = async (formData) => {
    console.log("[UsuariosPorEmpresa] handleSubmitUsuario - formData:", formData);
    console.log("[UsuariosPorEmpresa] selectedEmpresaId:", selectedEmpresaId);
    try {
      if (modalMode === "create") {
        // Incluir empresaId desde la empresa seleccionada
        await createUsuario({ ...formData, empresaId: selectedEmpresaId });
      } else {
        await updateUsuario(selectedUsuario.id, formData);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      console.error("[UsuariosPorEmpresa] Error response:", err.response?.data);
    }
  };

  const handleDelete = async () => {
    if (!usuarioToDelete) return;
    try {
      await deleteUsuario(usuarioToDelete.id);
      setShowDeleteConfirm(false);
      setUsuarioToDelete(null);
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    }
  };

  const handleToggleStatus = async (usuario) => {
    try {
      await toggleStatus(usuario.id);
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  const handleResetPassword = async (usuario) => {
    try {
      await resetPassword(usuario.id);
      alert(`Se ha enviado un email a ${usuario.email} con las instrucciones para restablecer la contraseña.`);
    } catch (err) {
      console.error("Error al resetear contraseña:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Estados de vista
  let view = "READY";
  if (loadingEmpresas) view = "LOADING";
  else if (errorEmpresas) view = "ERROR";
  else if (!empresas || empresas.length === 0) view = "EMPTY";

  // Loading State
  if (view === "LOADING") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (view === "ERROR" || view === "EMPTY") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconWarning className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {view === "ERROR" ? "Error al cargar" : "Sin empresas"}
          </h2>
          <p className="text-gray-500">
            {view === "ERROR" ? "No se pudo cargar la información." : "No hay empresas registradas."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-[#0B1437] via-[#1a2555] to-[#0B1437] text-white">
        <div className="px-6 py-6">
          {/* Top bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Usuarios por Empresa</h1>
              <p className="text-indigo-200 text-sm mt-1">Gestión de usuarios y permisos por empresa</p>
            </div>
            
            <button
              onClick={handleOpenCreate}
              disabled={!selectedEmpresaId}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconPlus className="w-5 h-5" />
              Nuevo Usuario
            </button>
          </div>

          {/* Selector de empresa */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs text-indigo-200 mb-1.5 font-medium uppercase tracking-wide">Empresa</label>
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
                    <span className="text-indigo-300">Total Usuarios:</span>
                    <span className="ml-2 font-semibold">{stats.total}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <IconSearchNew className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter by Rol */}
            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="">Todos los roles</option>
              <option value="ADMIN_EMPRESA">Admin Empresa</option>
              <option value="OPERADOR">Operador</option>
              <option value="CONTADOR">Contador</option>
              <option value="USER">Usuario</option>
            </select>

            {/* Filter by Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>

          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Lista de Usuarios</h3>
            <p className="text-sm text-gray-500">
              {filteredUsuarios.length} {filteredUsuarios.length === 1 ? 'usuario encontrado' : 'usuarios encontrados'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Último Acceso</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                        <p className="text-gray-500">Cargando usuarios...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsuarios.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <IconUsers className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No hay usuarios</p>
                        <p className="text-gray-400 text-sm">
                          {searchTerm || filterRol || filterStatus
                            ? "No se encontraron usuarios con los filtros aplicados"
                            : "Agrega el primer usuario para esta empresa"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsuarios.map((usuario, index) => (
                    <tr key={usuario.id ?? `user-${index}`} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar nombre={usuario.nombre} apellido={usuario.apellido} />
                          <p className="font-semibold text-gray-900">
                            {usuario.nombre} {usuario.apellido}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <IconMail className="w-4 h-4 text-gray-400" />
                          {usuario.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <RolBadge rol={usuario.rol} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge activo={usuario.activo} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(usuario.ultimoAcceso || usuario.lastLogin)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(usuario)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <IconEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(usuario)}
                            className={`p-2 rounded-lg transition-colors ${
                              usuario.activo
                                ? "text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                                : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title={usuario.activo ? "Desactivar" : "Activar"}
                          >
                            {usuario.activo ? <IconUserX className="w-4 h-4" /> : <IconUserCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleResetPassword(usuario)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Resetear contraseña"
                          >
                            <IconKey className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setUsuarioToDelete(usuario);
                              setShowDeleteConfirm(true);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <IconTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Crear/Editar Usuario */}
      <ModalUsuario
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitUsuario}
        loading={loadingCreate || loadingUpdate}
        usuario={selectedUsuario}
        mode={modalMode}
      />

      {/* Modal Confirmar Eliminación */}
      <ModalConfirmDelete
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        loading={loadingDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de eliminar al usuario?"
        itemName={`${usuarioToDelete?.nombre || ""} ${usuarioToDelete?.apellido || ""}`}
        itemDetail={usuarioToDelete?.email}
      />
    </div>
  );
}
